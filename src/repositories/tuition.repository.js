const db = require('../config/database');

class TuitionRepository {
  async findByProgram(programId) {
    const query = 'SELECT * FROM tuition_fees WHERE program_id = $1;';
    const { rows } = await db.query(query, [programId]);
    return rows;
  }
}

module.exports = new TuitionRepository();
