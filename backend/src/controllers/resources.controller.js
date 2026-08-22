const resourcesRepository = require('../repositories/resources.repository');
const resourcesService = require('../services/resources.service');
const { successResponse, errorResponse } = require('../utils/response');

class ResourcesController {
  async getResources(req, res, next) {
    try {
      const data = await resourcesRepository.findAll(req.query);
      return successResponse(res, 200, 'Resources retrieved successfully', data.rows, {
        total: data.totalCount,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages
      });
    } catch (err) {
      next(err);
    }
  }

  async getResourceById(req, res, next) {
    try {
      const data = await resourcesRepository.findById(req.params.id);
      if (!data) {
        const err = new Error('Resource not found');
        err.statusCode = 404;
        throw err;
      }
      return successResponse(res, 200, 'Resource retrieved', data);
    } catch (err) {
      next(err);
    }
  }

  async uploadResource(req, res, next) {
    try {
      if (!req.file) {
        return errorResponse(res, 400, 'No binary file attached in multipart/form-data request');
      }

      const result = await resourcesService.uploadAndIngest({
        file: req.file,
        metadata: req.body,
        user: req.user || null
      });

      return successResponse(res, 201, 'Educational resource uploaded and processed successfully', result);
    } catch (err) {
      next(err);
    }
  }

  async downloadResource(req, res, next) {
    try {
      const { stream, filename, mimeType } = await resourcesService.getDownloadStream(req.params.id, req.user);
      
      // Log download telemetry
      const userId = req.user ? req.user.id : null;
      await resourcesRepository.logDownload(req.params.id, userId, req.ip);

      res.setHeader('Content-Type', mimeType || 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename="' + (filename || 'resource') + '"');
      stream.pipe(res);
    } catch (err) {
      next(err);
    }
  }

  async streamResource(req, res, next) {
    try {
      const { stream, mimeType } = await resourcesService.getDownloadStream(req.params.id, req.user);
      
      // Log view telemetry
      const userId = req.user ? req.user.id : null;
      await resourcesRepository.logView(req.params.id, userId, req.ip);

      res.setHeader('Content-Type', mimeType || 'application/octet-stream');
      res.setHeader('Content-Disposition', 'inline');
      stream.pipe(res);
    } catch (err) {
      next(err);
    }
  }

  async approveResource(req, res, next) {
    try {
      const updated = await resourcesService.approveResource(req.params.id, req.user);
      return successResponse(res, 200, 'Resource approved for public publication', updated);
    } catch (err) {
      next(err);
    }
  }

  async rejectResource(req, res, next) {
    try {
      const { reason } = req.body;
      const updated = await resourcesService.rejectResource(req.params.id, req.user, reason);
      return successResponse(res, 200, 'Resource rejected', updated);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ResourcesController();
