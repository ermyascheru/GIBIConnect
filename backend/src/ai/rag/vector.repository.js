const db = require('../../config/database');

class VectorRepository {
  async insertChunks(chunks) {
    if (!chunks || chunks.length === 0) return 0;

    let inserted = 0;
    for (const c of chunks) {
      const query = `
        INSERT INTO rag_document_chunks (
          resource_id, research_id, institution_id, chunk_index, chunk_text,
          chunk_length, page_number, document_version, metadata, embedding
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::vector)
        ON CONFLICT (resource_id, chunk_index, document_version) 
        DO UPDATE SET chunk_text = EXCLUDED.chunk_text, embedding = EXCLUDED.embedding, metadata = EXCLUDED.metadata
        RETURNING id;
      `;

      const vecString = `[${c.embedding.join(',')}]`;
      const values = [
        c.resource_id || null,
        c.research_id || null,
        c.institution_id || null,
        c.chunk_index,
        c.chunk_text,
        c.chunk_length,
        c.page_number || 1,
        c.document_version || null,
        JSON.stringify(c.metadata || {}),
        vecString
      ];

      await db.query(query, values);
      inserted++;
    }
    return inserted;
  }

  async searchSimilar(queryVector, { topK = 5, similarityThreshold = 0.45, institutionId, resourceType, categoryId } = {}) {
    const vecString = `[${queryVector.join(',')}]`;
    const params = [vecString, similarityThreshold, topK];
    const conditions = [];

    if (institutionId) {
      params.push(institutionId);
      conditions.push(`c.institution_id = $${params.length}`);
    }

    const whereExtra = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        c.id,
        c.resource_id,
        c.research_id,
        c.institution_id,
        c.chunk_index,
        c.chunk_text,
        c.page_number,
        c.metadata,
        1 - (c.embedding <=> $1::vector) AS similarity,
        r.title AS resource_title,
        r.resource_type,
        r.file_extension,
        i.name AS institution_name,
        res.journal_name,
        res.doi
      FROM rag_document_chunks c
      LEFT JOIN resources r ON r.id = c.resource_id
      LEFT JOIN institutions i ON i.id = c.institution_id
      LEFT JOIN research res ON res.id = c.research_id
      WHERE (1 - (c.embedding <=> $1::vector)) >= $2
      ${whereExtra}
      ORDER BY similarity DESC
      LIMIT $3;
    `;

    const { rows } = await db.query(query, params);
    return rows;
  }

  async deleteByResourceId(resourceId) {
    await db.query('DELETE FROM rag_document_chunks WHERE resource_id = $1', [resourceId]);
  }

  async chunkCount() {
    const { rows } = await db.query('SELECT COUNT(*) AS count FROM rag_document_chunks');
    return parseInt(rows[0].count, 10);
  }
}

module.exports = new VectorRepository();
