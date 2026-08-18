class AIService {
  async processPrompt({ prompt, conversationId }) {
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    return {
      response: `AI processing completed for prompt: "${prompt}"`,
      conversationId: conversationId || `conv_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new AIService();
