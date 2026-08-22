const fs = require('fs');

class TextExtractorService {
  async extractText({ buffer, fileExtension, originalFilename, title, description, abstract }) {
    let extracted = '';

    try {
      const ext = (fileExtension || '').toLowerCase();

      if (['txt', 'csv', 'md', 'json'].includes(ext)) {
        extracted = buffer.toString('utf8');
      } else if (ext === 'pdf') {
        extracted = this.extractTextFromPdfBuffer(buffer);
      } else if (['docx', 'xlsx', 'pptx'].includes(ext)) {
        extracted = this.extractTextFromXmlBuffer(buffer);
      }
    } catch (err) {
      console.warn(`[TextExtractor] Warning extracting from ${originalFilename}:`, err.message);
    }

    // Combine extracted raw text with authoritative metadata for comprehensive indexing
    const parts = [];
    if (title) parts.push(`Title: ${title}`);
    if (description) parts.push(`Description: ${description}`);
    if (abstract) parts.push(`Abstract: ${abstract}`);
    if (extracted && extracted.trim().length > 0) {
      parts.push(`Document Content:\n${extracted.trim()}`);
    }

    return parts.join('\n\n');
  }

  extractTextFromPdfBuffer(buffer) {
    const content = buffer.toString('latin1');
    const textBlocks = [];
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let match;

    while ((match = streamRegex.exec(content)) !== null) {
      const streamData = match[1];
      // Extract text in PDF text blocks: (text) Tj or [(text)] TJ
      const textMatches = streamData.match(/\(([^)]+)\)\s*Tj/g);
      if (textMatches) {
        textMatches.forEach(tm => {
          const clean = tm.replace(/\(|\)\s*Tj/g, '').trim();
          if (clean.length > 1) textBlocks.push(clean);
        });
      }
    }

    if (textBlocks.length > 0) {
      return textBlocks.join(' ').replace(/\\/g, '');
    }

    // Fallback: extract printable ASCII text runs
    const asciiMatches = content.match(/[A-Za-z0-9 ,.;:()'"\-\n]{4,}/g);
    return (asciiMatches || []).slice(0, 100).join(' ');
  }

  extractTextFromXmlBuffer(buffer) {
    const content = buffer.toString('utf8');
    const xmlTextMatches = content.match(/<[^>]+>([^<]{2,})<\/[^>]+>/g);
    if (xmlTextMatches) {
      return xmlTextMatches
        .map(t => t.replace(/<[^>]+>/g, '').trim())
        .filter(t => t.length > 2)
        .join(' ');
    }
    return '';
  }
}

module.exports = new TextExtractorService();
