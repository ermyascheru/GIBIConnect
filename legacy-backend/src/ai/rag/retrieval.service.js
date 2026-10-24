const embeddingService = require('../embeddings/embedding.service');
const vectorRepository = require('./vector.repository');
const config = require('../config/ai.config');

class RetrievalService {
  async retrieve(queryText, options = {}) {
    const topK = options.topK || config.ragTopK;
    const similarityThreshold = options.similarityThreshold || config.ragSimilarityThreshold;

    // 1. Generate query embedding
    const queryVector = await embeddingService.generateEmbedding(queryText);

    // 2. Perform pgvector similarity search
    const chunks = await vectorRepository.searchSimilar(queryVector, {
      topK,
      similarityThreshold,
      institutionId: options.institutionId,
      resourceType: options.resourceType
    });

    return chunks.map(c => ({
      chunkId: c.id,
      resourceId: c.resource_id,
      researchId: c.research_id,
      institutionId: c.institution_id,
      institutionName: c.institution_name,
      title: c.resource_title || c.metadata?.title || 'Educational Resource',
      resourceType: c.resource_type,
      text: c.chunk_text,
      similarity: parseFloat(c.similarity).toFixed(4),
      page: c.page_number || 1,
      doi: c.doi || null,
      journalName: c.journal_name || null
    }));
  }
}

module.exports = new RetrievalService();
