const researchRepository = require('../repositories/research.repository');

class ResearchService {
  async getAllResearch(queryParams) {
    const limit = parseInt(queryParams.limit, 10) || 10;
    const offset = parseInt(queryParams.offset, 10) || 0;
    return await researchRepository.findAll({ limit, offset });
  }
}

module.exports = new ResearchService();
