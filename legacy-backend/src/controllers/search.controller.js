const searchRepository = require('../repositories/search.repository');
const { successResponse } = require('../utils/response');

class SearchController {
  async search(req, res, next) {
    try {
      const { q } = req.query;
      const results = q ? await searchRepository.searchAll(q) : [];
      return successResponse(res, 200, 'Search completed successfully', results);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SearchController();
