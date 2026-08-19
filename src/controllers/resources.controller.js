const resourceService = require('../services/resources.service');

class ResourceController {
  async getResources(req, res, next) {
    try {
      const data = await resourceService.getResources(req.query);
      return res.status(200).json({
        success: true,
        message: 'Resources retrieved successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ResourceController();
