const researchRepository = require('../repositories/research.repository');
const { successResponse } = require('../utils/response');

class ResearchController {
  async getAll(req, res, next) {
    try {
      const data = await researchRepository.findAll(req.query);
      return successResponse(res, 200, 'Research publications retrieved successfully', data.rows, {
        total: data.totalCount,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await researchRepository.findById(req.params.id);
      if (!data) {
        const err = new Error('Research publication not found');
        err.statusCode = 404;
        throw err;
      }
      return successResponse(res, 200, 'Research paper details retrieved', data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ResearchController();
