const resourcesRepository = require('../repositories/resources.repository');
const storageService = require('../storage/storage.service');
const textExtractorService = require('../storage/text-extractor.service');
const embeddingService = require('../ai/embeddings/embedding.service');
const chunkingService = require('../ai/ingestion/chunking.service');
const vectorRepository = require('../ai/rag/vector.repository');
const db = require('../config/database');

class ResourcesService {
  async uploadAndIngest({ file, metadata, user }) {
    if (!file || !file.buffer) {
      const err = new Error('No file attached for upload');
      err.statusCode = 400;
      throw err;
    }

    // 1. Save binary file to physical storage
    const storageResult = await storageService.saveFile({
      buffer: file.buffer,
      originalFilename: file.originalname,
      resourceType: metadata.resource_type || 'document'
    });

    // 2. Determine initial approval status based on user role
    const initialStatus = (user && (user.role === 'admin' || user.role === 'moderator')) ? 'approved' : 'pending';

    // 3. Extract text content
    const extractedText = await textExtractorService.extractText({
      buffer: file.buffer,
      fileExtension: storageResult.fileExtension,
      originalFilename: file.originalname,
      title: metadata.title,
      description: metadata.description,
      abstract: metadata.abstract
    });

    // 4. Create database record in PostgreSQL 'resources' table
    const resourceRecord = await resourcesRepository.create({
      title: metadata.title || file.originalname,
      description: metadata.description || null,
      resource_type: metadata.resource_type || 'document',
      mime_type: file.mimetype,
      file_extension: storageResult.fileExtension,
      original_filename: file.originalname,
      file_size_bytes: storageResult.fileSizeBytes,
      storage_provider: storageResult.storageProvider,
      storage_bucket: storageResult.storageBucket,
      storage_key: storageResult.storageKey,
      checksum: storageResult.checksum,
      uploaded_by: user ? user.id : null,
      institution_id: metadata.institution_id || null,
      faculty_id: metadata.faculty_id || null,
      department_id: metadata.department_id || null,
      program_id: metadata.program_id || null,
      publication_year: metadata.publication_year ? parseInt(metadata.publication_year, 10) : null,
      language: metadata.language || 'en',
      status: initialStatus,
      visibility: metadata.visibility || 'public'
    });

    // 5. If this is a research paper, create research and authors records
    let researchRecord = null;
    if (metadata.resource_type === 'research' || metadata.abstract || metadata.journal_name || metadata.doi) {
      const resQuery = `
        INSERT INTO research (resource_id, abstract, research_type, publication_year, journal_name, conference_name, doi, keywords, language)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      const keywords = typeof metadata.keywords === 'string' ? metadata.keywords.split(',').map(k => k.trim()) : (metadata.keywords || []);
      const { rows: rRows } = await db.query(resQuery, [
        resourceRecord.id,
        metadata.abstract || metadata.description || null,
        metadata.research_type || 'paper',
        metadata.publication_year ? parseInt(metadata.publication_year, 10) : null,
        metadata.journal_name || null,
        metadata.conference_name || null,
        metadata.doi || null,
        keywords,
        metadata.language || 'en'
      ]);
      researchRecord = rRows[0];
    }

    // 6. Asynchronous RAG Chunking & Vectorization
    try {
      if (extractedText && extractedText.length > 20) {
        const chunkMeta = {
          resource_id: resourceRecord.id,
          research_id: researchRecord ? researchRecord.id : null,
          institution_id: resourceRecord.institution_id,
          title: resourceRecord.title,
          resource_type: resourceRecord.resource_type,
          version: storageResult.checksum
        };

        const rawChunks = chunkingService.chunkText(extractedText, chunkMeta);
        const chunksWithEmbeddings = [];

        for (const c of rawChunks) {
          const embedding = await embeddingService.generateEmbedding(c.chunk_text);
          chunksWithEmbeddings.push({
            ...c,
            resource_id: resourceRecord.id,
            research_id: researchRecord ? researchRecord.id : null,
            institution_id: resourceRecord.institution_id,
            embedding
          });
        }

        if (chunksWithEmbeddings.length > 0) {
          await vectorRepository.insertChunks(chunksWithEmbeddings);
        }
      }

      await db.query("UPDATE resources SET processing_status = 'processed', extracted_text = $1 WHERE id = $2", [
        extractedText,
        resourceRecord.id
      ]);
    } catch (vectorErr) {
      console.error('[ResourcesService] Vectorization error:', vectorErr.message);
      await db.query("UPDATE resources SET processing_status = 'failed', processing_error = $1 WHERE id = $2", [
        vectorErr.message,
        resourceRecord.id
      ]);
    }

    return {
      resource: resourceRecord,
      research: researchRecord,
      storageKey: storageResult.storageKey,
      fileSize: storageResult.fileSizeBytes,
      checksum: storageResult.checksum,
      status: initialStatus
    };
  }

  async getDownloadStream(resourceId, user = null) {
    const resource = await resourcesRepository.findById(resourceId);
    if (!resource) {
      const err = new Error('Resource not found');
      err.statusCode = 404;
      throw err;
    }

    // Check visibility permissions
    if (resource.visibility === 'private' && (!user || user.id !== resource.uploaded_by)) {
      const err = new Error('Access denied: Private educational resource');
      err.statusCode = 403;
      throw err;
    }

    const stream = storageService.getFileStream(resource.storage_key);
    return {
      stream,
      filename: resource.original_filename,
      mimeType: resource.mime_type,
      fileSizeBytes: resource.file_size_bytes
    };
  }

  async approveResource(resourceId, user) {
    const query = "UPDATE resources SET status = 'approved', updated_at = NOW() WHERE id = $1 RETURNING *";
    const { rows } = await db.query(query, [resourceId]);
    if (rows.length === 0) {
      const err = new Error('Resource not found');
      err.statusCode = 404;
      throw err;
    }
    return rows[0];
  }

  async rejectResource(resourceId, user, reason = '') {
    const query = "UPDATE resources SET status = 'rejected', processing_error = $2, updated_at = NOW() WHERE id = $1 RETURNING *";
    const { rows } = await db.query(query, [resourceId, reason || 'Rejected by moderator']);
    if (rows.length === 0) {
      const err = new Error('Resource not found');
      err.statusCode = 404;
      throw err;
    }
    return rows[0];
  }
}

module.exports = new ResourcesService();
