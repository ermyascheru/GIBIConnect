const resourceService = require('../services/resources.service');
const { sendSuccess } = require('../utils/response');

class ResourceController {
  async getResources(req, res, next) {
    try {
      const data = await resourceService.getResources(req.query);
      return sendSuccess(res, data, 'Resources retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ResourceController();
