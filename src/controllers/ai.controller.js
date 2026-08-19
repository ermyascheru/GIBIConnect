const aiService = require('../services/ai.service');

class AIController {
  async prompt(req, res, next) {
    try {
      const result = await aiService.processPrompt(req.body);
      return res.status(200).json({
        success: true,
        message: 'AI response generated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();
