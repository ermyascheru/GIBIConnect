const aiOrchestrator = require('../ai/orchestration/ai.orchestrator');
const retrievalService = require('../ai/rag/retrieval.service');
const ingestionService = require('../ai/ingestion/ingestion.service');
const embeddingService = require('../ai/embeddings/embedding.service');
const llmService = require('../ai/llm/llm.service');
const ollamaClient = require('../ai/ollama/ollama.client');
const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

class AIController {
  async chat(req, res, next) {
    try {
      const { prompt, message, conversation_id, institution_id } = req.body;
      const userPrompt = prompt || message;
      const userId = req.user ? req.user.id : null;

      const result = await aiOrchestrator.processConsultation({
        prompt: userPrompt,
        conversation_id,
        institution_id,
        userId
      });

      return successResponse(res, 200, 'AI consultation generated', result);
    } catch (err) {
      next(err);
    }
  }

  async search(req, res, next) {
    try {
      const { q, query, topK, institution_id, resource_type } = req.body.q ? req.body : req.query;
      const searchTerms = q || query;
      if (!searchTerms) {
        return errorResponse(res, 400, 'Search query is required');
      }

      const results = await retrievalService.retrieve(searchTerms, {
        topK: topK ? parseInt(topK, 10) : 5,
        institutionId: institution_id,
        resourceType: resource_type
      });

      return successResponse(res, 200, 'Semantic vector search results retrieved', results);
    } catch (err) {
      next(err);
    }
  }

  async ingest(req, res, next) {
    try {
      const { resource_id, all } = req.body;
      if (all) {
        const results = await ingestionService.ingestAllApprovedResources();
        return successResponse(res, 200, 'Approved resources ingestion completed', results);
      }
      if (!resource_id) {
        return errorResponse(res, 400, 'Resource ID is required for ingestion');
      }

      const result = await ingestionService.ingestResource(resource_id);
      return successResponse(res, 200, 'Resource ingested and vectorized', result);
    } catch (err) {
      next(err);
    }
  }

  async health(req, res, next) {
    try {
      const startTime = Date.now();

      // 1. Check PostgreSQL & pgvector
      let dbHealthy = false;
      let pgvectorHealthy = false;
      try {
        const dbRes = await db.query("SELECT extname FROM pg_extension WHERE extname = 'vector'");
        dbHealthy = true;
        pgvectorHealthy = dbRes.rows.length > 0;
      } catch (e) {
        dbHealthy = false;
      }

      // 2. Check Ollama server & models
      const ollamaStatus = await ollamaClient.healthCheck();
      const embeddingStatus = await embeddingService.healthCheck();
      const llmStatus = await llmService.healthCheck();

      const isAllHealthy = dbHealthy && pgvectorHealthy && ollamaStatus.healthy && embeddingStatus.healthy && llmStatus.healthy;

      const payload = {
        status: isAllHealthy ? 'healthy' : 'degraded',
        latencyMs: Date.now() - startTime,
        checks: {
          postgresql: { healthy: dbHealthy },
          pgvector: { healthy: pgvectorHealthy },
          ollama: ollamaStatus,
          embeddingModel: embeddingStatus,
          llmModel: llmStatus
        }
      };

      return successResponse(res, isAllHealthy ? 200 : 503, 'AI Subsystem Health Status', payload);
    } catch (err) {
      return errorResponse(res, 500, 'AI health check failed', { message: err.message });
    }
  }
}

module.exports = new AIController();
