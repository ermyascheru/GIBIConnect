const embeddingService = require('../embeddings/embedding.service');
const chunkingService = require('./chunking.service');
const documentExtractor = require('./document.extractor');
const vectorRepository = require('../rag/vector.repository');
const db = require('../../config/database');

class IngestionService {
  async ingestResource(resourceId) {
    // 1. Fetch resource and research metadata
    const query = `
      SELECT r.*, res.id AS research_id, res.abstract, res.journal_name, res.conference_name, res.doi, res.keywords,
             i.name AS institution_name
      FROM resources r
      LEFT JOIN research res ON res.resource_id = r.id
      LEFT JOIN institutions i ON i.id = r.institution_id
      WHERE r.id = $1
    `;
    const { rows } = await db.query(query, [resourceId]);
    if (rows.length === 0) throw new Error('Resource not found for ingestion');
    const resource = rows[0];

    // 2. Extract full text
    let fullText = '';
    if (resource.research_id) {
      fullText = documentExtractor.extractResearchText(resource, resource);
    } else {
      fullText = documentExtractor.extractResourceText(resource);
    }

    if (!fullText || fullText.trim().length < 20) {
      return { ingested: false, reason: 'Insufficient text content for embedding' };
    }

    // 3. Chunk text
    const metadata = {
      resource_id: resource.id,
      research_id: resource.research_id || null,
      institution_id: resource.institution_id || null,
      institution_name: resource.institution_name || null,
      title: resource.title,
      resource_type: resource.resource_type,
      version: resource.checksum || `v_${resource.updated_at ? new Date(resource.updated_at).getTime() : Date.now()}`
    };

    const rawChunks = chunkingService.chunkText(fullText, metadata);
    if (rawChunks.length === 0) return { ingested: false, reason: 'No valid chunks generated' };

    // 4. Generate embeddings for all chunks
    const chunksWithEmbeddings = [];
    for (const chunk of rawChunks) {
      const embedding = await embeddingService.generateEmbedding(chunk.chunk_text);
      chunksWithEmbeddings.push({
        ...chunk,
        resource_id: resource.id,
        research_id: resource.research_id || null,
        institution_id: resource.institution_id || null,
        embedding
      });
    }

    // 5. Save vector chunks in PostgreSQL
    const insertedCount = await vectorRepository.insertChunks(chunksWithEmbeddings);

    // 6. Update resource status
    await db.query("UPDATE resources SET processing_status = 'processed' WHERE id = $1", [resourceId]);

    return {
      ingested: true,
      resourceId: resource.id,
      title: resource.title,
      chunksCount: insertedCount
    };
  }

  async ingestAllApprovedResources() {
    const { rows } = await db.query("SELECT id FROM resources WHERE status = 'approved'");
    const results = [];
    for (const r of rows) {
      try {
        const res = await this.ingestResource(r.id);
        results.push(res);
      } catch (err) {
        results.push({ resourceId: r.id, ingested: false, error: err.message });
      }
    }
    return results;
  }
}

module.exports = new IngestionService();
