module.exports = {
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  llmProvider: process.env.LLM_PROVIDER || 'ollama',
  llmModel: process.env.LLM_MODEL || 'llama3.2:latest',
  embeddingProvider: process.env.EMBEDDING_PROVIDER || 'ollama',
  embeddingModel: process.env.EMBEDDING_MODEL || 'nomic-embed-text:latest',
  vectorDimension: parseInt(process.env.VECTOR_DIMENSION || '768', 10),
  ragTopK: parseInt(process.env.RAG_TOP_K || '5', 10),
  ragSimilarityThreshold: parseFloat(process.env.RAG_SIMILARITY_THRESHOLD || '0.50'),
  chunkSize: parseInt(process.env.CHUNK_SIZE || '500', 10),
  chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '60', 10),
  minChunkLength: parseInt(process.env.MIN_CHUNK_LENGTH || '30', 10),
  aiTemperature: parseFloat(process.env.AI_TEMPERATURE || '0.2'),
  aiMaxTokens: parseInt(process.env.AI_MAX_TOKENS || '500', 10),
  aiTimeout: parseInt(process.env.AI_TIMEOUT || '90000', 10)
};
