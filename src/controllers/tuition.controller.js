const tuitionService = require('../services/tuition.service');
const { sendSuccess } = require('../utils/response');

class TuitionController {
  async getTuition(req, res, next) {
    try {
      const data = await tuitionService.getTuitionByProgram(req.params.programId);
      return sendSuccess(res, data, 'Tuition data fetched successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TuitionController();
