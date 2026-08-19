const searchService = require('../services/search.service');

class SearchController {
  async search(req, res, next) {
    try {
      const { q } = req.query;
      const results = q ? await searchService.query(q) : [];
      return res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: results
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SearchController();
