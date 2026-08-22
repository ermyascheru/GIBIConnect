const crypto = require('crypto');
const config = require('../config/ai.config');

class ChunkingService {
  chunkText(text, metadata = {}, chunkSize = config.chunkSize, chunkOverlap = config.chunkOverlap) {
    if (!text || typeof text !== 'string') return [];
    const clean = text.replace(/\r\n/g, '\n').replace(/\t/g, ' ').replace(/ +/g, ' ').trim();
    if (clean.length < config.minChunkLength) return [];

    const chunks = [];
    let start = 0;
    let index = 0;

    while (start < clean.length) {
      let end = start + chunkSize;
      if (end < clean.length) {
        // Try to break at sentence or paragraph boundary
        const nextPeriod = clean.indexOf('. ', end - 60);
        const nextNewline = clean.indexOf('\n', end - 60);
        if (nextNewline !== -1 && nextNewline < end + 40) {
          end = nextNewline + 1;
        } else if (nextPeriod !== -1 && nextPeriod < end + 40) {
          end = nextPeriod + 2;
        }
      } else {
        end = clean.length;
      }

      const chunkStr = clean.slice(start, end).trim();
      if (chunkStr.length >= config.minChunkLength) {
        chunks.push({
          chunk_index: index++,
          chunk_text: chunkStr,
          chunk_length: chunkStr.length,
          page_number: metadata.page || 1,
          document_version: metadata.version || crypto.createHash('md5').update(clean).digest('hex'),
          metadata: {
            ...metadata,
            char_start: start,
            char_end: end
          }
        });
      }

      if (end >= clean.length) break;
      start = Math.max(end - chunkOverlap, start + 1);
    }

    return chunks;
  }
}

module.exports = new ChunkingService();
