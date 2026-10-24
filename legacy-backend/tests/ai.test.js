jest.mock('../src/ai/ollama/ollama.client', () => ({
  generateEmbedding: jest.fn()
}));

const ollamaClient = require('../src/ai/ollama/ollama.client');
const embeddingService = require('../src/ai/embeddings/embedding.service');
const queryClassifier = require('../src/ai/orchestration/query.classifier');
const contextBuilder = require('../src/ai/rag/context.builder');

describe('GIBIConnect AI/RAG Unit Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('Query classifier', () => {
    test('classifies tuition questions as structured', () => {
      const result = queryClassifier.classify(
        'How much is the tuition fee for this program?'
      );

      expect(result.intent).toBe('STRUCTURED');
      expect(result.categories.isTuition).toBe(true);
    });

    test('classifies document summarization as RAG', () => {
      const result = queryClassifier.classify(
        'Summarize this research paper'
      );

      expect(result.intent).toBe('RAG');
    });

    test('classifies university admission questions as hybrid', () => {
      const result = queryClassifier.classify(
        'What are the admission requirements at this university?'
      );

      expect(result.intent).toBe('HYBRID');
      expect(result.categories.isUniversity).toBe(true);
      expect(result.categories.isAdmission).toBe(true);
    });

    test('classifies unrelated questions as general', () => {
      const result = queryClassifier.classify('Hello, how are you?');

      expect(result.intent).toBe('GENERAL');
    });
  });

  describe('Context builder', () => {
    test('builds authoritative institution context', () => {
      const context = contextBuilder.buildContext({
        structuredData: {
          institutions: [{
            id: 1,
            name: 'Example University',
            type: 'university',
            ownership: 'public',
            city: 'Addis Ababa',
            region: 'Addis Ababa'
          }]
        }
      });

      expect(context).toContain('AUTHORITATIVE GIBICONNECT DATABASE RECORDS');
      expect(context).toContain('Example University');
    });

    test('adds retrieved document chunks as passive data', () => {
      const context = contextBuilder.buildContext({
        ragChunks: [{
          resourceId: 5,
          resourceType: 'research',
          title: 'AI Research',
          institutionName: 'Example University',
          page: 2,
          text: 'Research document content'
        }]
      });

      expect(context).toContain('RETRIEVED EDUCATIONAL DOCUMENTS');
      expect(context).toContain('<document_data');
      expect(context).toContain('Research document content');
    });

    test('returns empty context when no data is supplied', () => {
      expect(contextBuilder.buildContext({})).toBe('');
    });
  });

  describe('Embedding service', () => {
    test('rejects empty text', async () => {
      await expect(
        embeddingService.generateEmbedding('   ')
      ).rejects.toThrow('Text is required for embedding generation');

      expect(ollamaClient.generateEmbedding).not.toHaveBeenCalled();
    });

    test('normalizes whitespace before sending text to Ollama', async () => {
      ollamaClient.generateEmbedding.mockResolvedValue([1, 2, 3]);

      await embeddingService.generateEmbedding('  hello   world \n test  ');

      expect(ollamaClient.generateEmbedding).toHaveBeenCalledWith(
        'hello world test',
        embeddingService.getModel()
      );
    });

    test('generates embeddings for multiple texts', async () => {
      ollamaClient.generateEmbedding
        .mockResolvedValueOnce([1, 2])
        .mockResolvedValueOnce([3, 4]);

      await expect(
        embeddingService.generateEmbeddings(['first', 'second'])
      ).resolves.toEqual([[1, 2], [3, 4]]);
    });

    test('returns empty array for empty input list', async () => {
      await expect(embeddingService.generateEmbeddings([]))
        .resolves.toEqual([]);
    });
  });
});
