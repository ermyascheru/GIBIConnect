const researchService = require('../services/research.service');

class ResearchController {
  async getAll(req, res, next) {
    try {
      const data = await researchService.getAllResearch(req.query);
      return res.status(200).json({
        success: true,
        message: 'Research papers retrieved successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ResearchController();
