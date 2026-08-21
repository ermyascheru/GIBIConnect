const ollamaClient = require('../ollama/ollama.client');
const config = require('../config/ai.config');

class EmbeddingService {
  constructor() {
    this.model = config.embeddingModel;
    this.dimensions = config.vectorDimension;
  }

  getModel() {
    return this.model;
  }

  getDimensions() {
    return this.dimensions;
  }

  async healthCheck() {
    try {
      const testVec = await this.generateEmbedding('healthcheck');
      return {
        healthy: true,
        model: this.model,
        dimensionVerified: testVec.length === this.dimensions,
        actualDimension: testVec.length
      };
    } catch (err) {
      return { healthy: false, error: err.message };
    }
  }

  async generateEmbedding(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Text is required for embedding generation');
    }
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const vec = await ollamaClient.generateEmbedding(cleanText, this.model);
    if (vec.length !== this.dimensions) {
      console.warn(`[EmbeddingService] Dimension mismatch! Expected ${this.dimensions}, got ${vec.length}`);
    }
    return vec;
  }

  async generateEmbeddings(texts) {
    if (!Array.isArray(texts) || texts.length === 0) return [];
    const results = [];
    for (const text of texts) {
      const vec = await this.generateEmbedding(text);
      results.push(vec);
    }
    return results;
  }
}

module.exports = new EmbeddingService();
