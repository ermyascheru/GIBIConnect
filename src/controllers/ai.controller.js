const aiService = require('../services/ai.service');
const { sendSuccess } = require('../utils/response');

class AIController {
  async prompt(req, res, next) {
    try {
      const result = await aiService.processPrompt(req.body);
      return sendSuccess(res, result, 'AI response generated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();
