class DocumentExtractor {
  extractResourceText(resource) {
    const parts = [];
    if (resource.title) parts.push(`Title: ${resource.title}`);
    if (resource.description) parts.push(`Description: ${resource.description}`);
    if (resource.extracted_text) parts.push(`Content: ${resource.extracted_text}`);
    if (resource.transcript) parts.push(`Transcript: ${resource.transcript}`);
    return parts.join('\n\n');
  }

  extractResearchText(research, resource = {}) {
    const parts = [];
    if (resource.title) parts.push(`Research Title: ${resource.title}`);
    if (research.abstract) parts.push(`Abstract: ${research.abstract}`);
    if (research.journal_name) parts.push(`Journal: ${research.journal_name}`);
    if (research.conference_name) parts.push(`Conference: ${research.conference_name}`);
    if (research.keywords && Array.isArray(research.keywords)) {
      parts.push(`Keywords: ${research.keywords.join(', ')}`);
    }
    if (resource.extracted_text) parts.push(`Paper Content: ${resource.extracted_text}`);
    return parts.join('\n\n');
  }
}

module.exports = new DocumentExtractor();
