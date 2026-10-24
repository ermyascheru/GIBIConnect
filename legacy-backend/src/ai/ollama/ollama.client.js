const config = require('../config/ai.config');

class OllamaClient {
  constructor() {
    this.baseUrl = config.ollamaBaseUrl;
  }

  getTimeout() {
    return config.aiTimeout || 90000;
  }

  async healthCheck() {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) return { healthy: false, error: `HTTP ${res.status}` };
      const data = await res.json();
      const models = (data.models || []).map(m => m.name);
      return {
        healthy: true,
        models,
        hasLLM: models.some(m => m.includes(config.llmModel) || m === config.llmModel),
        hasEmbedding: models.some(m => m.includes(config.embeddingModel) || m === config.embeddingModel)
      };
    } catch (err) {
      return { healthy: false, error: err.message };
    }
  }

  async generateEmbedding(text, model = config.embeddingModel) {
    try {
      const res = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt: text }),
        signal: AbortSignal.timeout(this.getTimeout())
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Ollama Embedding Error (${res.status}): ${errorText}`);
      }
      const data = await res.json();
      if (!data.embedding || !Array.isArray(data.embedding)) {
        throw new Error('Ollama returned invalid embedding format');
      }
      return data.embedding;
    } catch (err) {
      throw new Error(`Embedding Generation Failed: ${err.message}`);
    }
  }

  async chat({ messages, system = '', model = config.llmModel, temperature = config.aiTemperature, maxTokens = config.aiMaxTokens }) {
    try {
      const formattedMessages = [];
      if (system) {
        formattedMessages.push({ role: 'system', content: system });
      }
      formattedMessages.push(...messages);

      const res = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          stream: false,
          options: {
            temperature,
            num_predict: maxTokens
          }
        }),
        signal: AbortSignal.timeout(this.getTimeout())
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Ollama Chat Error (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      return data.message ? data.message.content : '';
    } catch (err) {
      throw new Error(`LLM Inference Failed: ${err.message}`);
    }
  }
}

module.exports = new OllamaClient();
