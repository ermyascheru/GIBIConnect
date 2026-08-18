const tuitionRepository = require('../repositories/tuition.repository');

class TuitionService {
  async getTuitionByProgram(programId) {
    return await tuitionRepository.findByProgram(programId);
  }
}

module.exports = new TuitionService();
