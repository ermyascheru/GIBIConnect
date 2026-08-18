const researchService = require('../services/research.service');
const { sendSuccess } = require('../utils/response');

class ResearchController {
  async getAll(req, res, next) {
    try {
      const data = await researchService.getAllResearch(req.query);
      return sendSuccess(res, data, 'Research papers retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ResearchController();
