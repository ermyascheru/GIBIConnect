const searchService = require('../services/search.service');
const { sendSuccess } = require('../utils/response');

class SearchController {
  async search(req, res, next) {
    try {
      const { q } = req.query;
      const results = q ? await searchService.query(q) : [];
      return sendSuccess(res, results, 'Search completed successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SearchController();
