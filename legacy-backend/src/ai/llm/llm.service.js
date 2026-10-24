const ollamaClient = require('../ollama/ollama.client');
const config = require('../config/ai.config');

class LLMService {
  constructor() {
    this.model = config.llmModel;
  }

  getModel() {
    return this.model;
  }

  async healthCheck() {
    try {
      const response = await this.generate({
        prompt: 'Respond with the word "OK"',
        maxTokens: 5
      });
      return {
        healthy: true,
        model: this.model,
        response: response.trim()
      };
    } catch (err) {
      return { healthy: false, error: err.message };
    }
  }

  async generate({ prompt, system = '', messages = [], temperature, maxTokens }) {
    const formattedMessages = messages.length > 0
      ? messages
      : [{ role: 'user', content: prompt }];

    return await ollamaClient.chat({
      messages: formattedMessages,
      system,
      model: this.model,
      temperature,
      maxTokens
    });
  }
}

module.exports = new LLMService();
