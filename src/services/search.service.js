const searchRepository = require('../repositories/search.repository');

class SearchService {
  async query(term) {
    return await searchRepository.globalSearch(term);
  }
}

module.exports = new SearchService();
