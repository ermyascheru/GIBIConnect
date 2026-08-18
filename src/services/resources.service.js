const resourceRepository = require('../repositories/resources.repository');

class ResourceService {
  async getResources(queryParams) {
    const limit = parseInt(queryParams.limit, 10) || 10;
    const offset = parseInt(queryParams.offset, 10) || 0;
    return await resourceRepository.findAll({ limit, offset, category: queryParams.category });
  }
}

module.exports = new ResourceService();
