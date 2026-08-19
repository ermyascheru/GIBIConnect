const tuitionService = require('../services/tuition.service');

class TuitionController {
  async getTuition(req, res, next) {
    try {
      const data = await tuitionService.getTuitionByProgram(req.params.programId);
      return res.status(200).json({
        success: true,
        message: 'Tuition data fetched successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TuitionController();
