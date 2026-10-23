jest.mock('../src/repositories/resources.repository', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  logDownload: jest.fn(),
  logView: jest.fn(),
  findAll: jest.fn()
}));

jest.mock('../src/storage/storage.service', () => ({
  saveFile: jest.fn(),
  getFileStream: jest.fn()
}));

jest.mock('../src/storage/text-extractor.service', () => ({
  extractText: jest.fn()
}));

jest.mock('../src/ai/embeddings/embedding.service', () => ({
  generateEmbedding: jest.fn()
}));

jest.mock('../src/ai/ingestion/chunking.service', () => ({
  chunkText: jest.fn()
}));

jest.mock('../src/ai/rag/vector.repository', () => ({
  insertChunks: jest.fn()
}));

jest.mock('../src/config/database', () => ({
  query: jest.fn()
}));

const resourcesRepository = require('../src/repositories/resources.repository');
const storageService = require('../src/storage/storage.service');
const db = require('../src/config/database');
const resourcesService = require('../src/services/resources.service');

describe('GIBIConnect Resources Service', () => {
  beforeEach(() => jest.clearAllMocks());

  test('rejects upload when no file is supplied', async () => {
    await expect(resourcesService.uploadAndIngest({
      file: null,
      metadata: {},
      user: { id: 1, role: 'student' }
    })).rejects.toMatchObject({
      message: 'No file attached for upload',
      statusCode: 400
    });
  });

  test('denies private resource access to another user', async () => {
    resourcesRepository.findById.mockResolvedValue({
      id: 1,
      visibility: 'private',
      uploaded_by: 10,
      storage_key: 'private/file.pdf'
    });

    await expect(
      resourcesService.getDownloadStream(1, { id: 20 })
    ).rejects.toMatchObject({
      message: 'Access denied: Private educational resource',
      statusCode: 403
    });
  });

  test('allows owner to access a private resource', async () => {
    resourcesRepository.findById.mockResolvedValue({
      id: 1,
      visibility: 'private',
      uploaded_by: 10,
      storage_key: 'private/file.pdf',
      original_filename: 'file.pdf',
      mime_type: 'application/pdf',
      file_size_bytes: 100
    });

    const stream = { pipe: jest.fn() };
    storageService.getFileStream.mockReturnValue(stream);

    await expect(
      resourcesService.getDownloadStream(1, { id: 10 })
    ).resolves.toEqual({
      stream,
      filename: 'file.pdf',
      mimeType: 'application/pdf',
      fileSizeBytes: 100
    });
  });

  test('throws 404 when resource does not exist', async () => {
    resourcesRepository.findById.mockResolvedValue(null);

    await expect(resourcesService.getDownloadStream(999, { id: 1 }))
      .rejects.toMatchObject({
        message: 'Resource not found',
        statusCode: 404
      });
  });

  test('approves an existing resource', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: 1, status: 'approved' }]
    });

    await expect(resourcesService.approveResource(1, { id: 2 }))
      .resolves.toEqual({ id: 1, status: 'approved' });

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("status = 'approved'"),
      [1]
    );
  });

  test('rejects an existing resource with a reason', async () => {
    db.query.mockResolvedValue({
      rows: [{ id: 1, status: 'rejected', processing_error: 'Missing citation' }]
    });

    await expect(
      resourcesService.rejectResource(1, { id: 2 }, 'Missing citation')
    ).resolves.toEqual({
      id: 1,
      status: 'rejected',
      processing_error: 'Missing citation'
    });
  });
});
