const llmService = require('../llm/llm.service');
const retrievalService = require('../rag/retrieval.service');
const structuredRetriever = require('./structured.retriever');
const queryClassifier = require('./query.classifier');
const contextBuilder = require('../rag/context.builder');
const aiRepository = require('../rag/vector.repository'); // can access db
const systemPrompt = require('../security/ai.system-prompt');
const db = require('../../config/database');

class AIOrchestrator {
  async processConsultation({ prompt, conversation_id, institution_id, userId = null }) {
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      const err = new Error('User prompt is required');
      err.statusCode = 400;
      throw err;
    }

    const cleanPrompt = prompt.trim();

    // 1. Establish or retrieve persistent conversation session
    let convId = conversation_id;
    if (convId) {
      const check = await db.query('SELECT id FROM ai_conversations WHERE id = $1', [convId]);
      if (check.rows.length === 0) convId = null;
    }
    if (!convId) {
      const title = cleanPrompt.slice(0, 50);
      const res = await db.query(
        'INSERT INTO ai_conversations (user_id, institution_context_id, title) VALUES ($1, $2, $3) RETURNING id',
        [userId || null, institution_id || null, title]
      );
      convId = res.rows[0].id;
    }

    // 2. Persist incoming user turn
    await db.query(
      'INSERT INTO ai_messages (conversation_id, role, content) VALUES ($1, $2, $3)',
      [convId, 'user', cleanPrompt]
    );

    // 3. Classify query intent
    const { intent, categories } = queryClassifier.classify(cleanPrompt);

    // 4. Retrieve structured data if needed
    const structuredData = {};
    if (intent === 'STRUCTURED' || intent === 'HYBRID' || categories.isUniversity || categories.isProgram || categories.isTuition || categories.isScholarship) {
      if (categories.isUniversity || intent === 'STRUCTURED') {
        structuredData.institutions = await structuredRetriever.findInstitutions({
          name: categories.isUniversity ? cleanPrompt.split(' ')[0] : undefined
        });
      }
      if (categories.isProgram || intent === 'HYBRID') {
        structuredData.programs = await structuredRetriever.findPrograms({
          keyword: cleanPrompt.replace(/(which|universities|programs|in|ethiopia|offer|teach|have|what|is)/gi, '').trim(),
          institution_id: institution_id || undefined
        });
      }
      if (categories.isTuition) {
        structuredData.tuition = await structuredRetriever.findTuitionFees({ institution_id });
      }
      if (categories.isScholarship) {
        structuredData.scholarships = await structuredRetriever.findScholarships();
      }
    }

    // 5. Retrieve RAG vector chunks if needed
    let ragChunks = [];
    if (intent === 'RAG' || intent === 'HYBRID' || categories.isResearch || categories.isAdmission || (structuredData.programs && structuredData.programs.length === 0)) {
      try {
        ragChunks = await retrievalService.retrieve(cleanPrompt, {
          topK: 4,
          institutionId: institution_id || undefined
        });
      } catch (err) {
        console.warn('[AIOrchestrator] RAG retrieval error (falling back to structured):', err.message);
      }
    }

    // 6. Assemble controlled context
    const assembledContext = contextBuilder.buildContext({
      structuredData,
      ragChunks
    });

    // 7. Execute Llama 3.2 inference
    const userMessageContent = assembledContext
      ? `CONTEXT INFORMATION:\n${assembledContext}\n\nUSER QUESTION:\n${cleanPrompt}`
      : cleanPrompt;

    let answer = '';
    try {
      answer = await llmService.generate({
        system: systemPrompt,
        prompt: userMessageContent
      });
    } catch (err) {
      console.error('[AIOrchestrator] LLM invocation failed:', err.message);
      answer = 'I apologize, but the AI reasoning engine is currently completing an update. Please try your question again in a moment.';
    }

    // 8. Compile verified sources
    const sources = ragChunks.map(c => ({
      title: c.title,
      type: c.resourceType || 'document',
      resourceId: c.resourceId,
      researchId: c.researchId,
      institutionId: c.institutionId,
      institutionName: c.institutionName,
      page: c.page,
      similarity: c.similarity
    }));

    // 9. Persist assistant turn with citations
    await db.query(
      'INSERT INTO ai_messages (conversation_id, role, content, retrieved_context) VALUES ($1, $2, $3, $4)',
      [convId, 'assistant', answer, JSON.stringify({ intent, sources, structuredCounts: Object.keys(structuredData) })]
    );

    return {
      conversation_id: convId,
      intent,
      answer,
      sources
    };
  }
}

module.exports = new AIOrchestrator();
