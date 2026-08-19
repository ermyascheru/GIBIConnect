const searchRepository = require('../repositories/search.repository');

class SearchService {
  async query(term) {
    return await searchRepository.searchAll(term);
  }
}

module.exports = new SearchService();
