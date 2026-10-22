/**
 * GIBIConnect — Document RAG Indexing & Scoped Retrieval Service
 * Handles user-uploaded document indexing, vector embeddings, BM25 keyword matching,
 * chapter/unit boundary mapping, and scoped multi-stage retrieval to ground AI answers in attached files.
 */

import { documentParserService, type ParsedDocument } from './document.parser.js';
import { documentChunkerService, type DocumentChunk } from './document.chunker.js';
import { llmClient } from './services/llm.client.js';

export interface ScoredDocumentChunk {
  chunk: DocumentChunk;
  vectorScore: number;
  keywordScore: number;
  rrfScore: number;
}

export interface DocumentChapterInfo {
  chapterNumber: number;
  chapterTitle: string;
  startPage: number;
  endPage: number;
  chunkIds: string[];
}

export interface IngestedDocumentRecord {
  documentId: string;
  fileName: string;
  mimeType: string;
  totalPages: number;
  totalChunks: number;
  totalChars: number;
  uploadedAt: string;
  summary?: string;
  chapters: DocumentChapterInfo[];
  chunks: DocumentChunk[];
}

export class DocumentRAGService {
  // In-memory document registry for uploaded files (keyed by documentId)
  private documents = new Map<string, IngestedDocumentRecord>();
  // Hash deduplication map to prevent repeated expensive parsing and embedding
  private hashToRecordMap = new Map<string, IngestedDocumentRecord>();

  /**
   * Ingests a raw file buffer: parses text, generates semantic chunks,
   * generates 768-dim embeddings, maps chapter boundaries, and registers the document for RAG retrieval.
   */
  async ingestDocumentBuffer(
    buffer: Buffer,
    fileName: string,
    mimeType?: string
  ): Promise<IngestedDocumentRecord> {
    // 1. Parse document into pages & text
    const parsedDoc = await documentParserService.parseBuffer(buffer, fileName, mimeType);

    // Check hash deduplication cache
    if (parsedDoc.documentHash && this.hashToRecordMap.has(parsedDoc.documentHash)) {
      const cached = this.hashToRecordMap.get(parsedDoc.documentHash)!;
      // Deep clone chunks so each chunk is strictly tied to this documentId
      const clonedChunks = cached.chunks.map((c, idx) => ({
        ...c,
        id: `chunk-${parsedDoc.documentId}-${idx}`,
        documentId: parsedDoc.documentId,
        fileName: parsedDoc.fileName,
      }));

      const record: IngestedDocumentRecord = {
        ...cached,
        documentId: parsedDoc.documentId,
        fileName: parsedDoc.fileName,
        uploadedAt: new Date().toISOString(),
        chunks: clonedChunks,
      };
      this.documents.set(parsedDoc.documentId, record);
      return record;
    }

    // 2. Chunk document into semantic, page-tracked units
    const chunks = documentChunkerService.chunkDocument(parsedDoc);

    // 3. Generate 768-dim embeddings for each chunk
    for (const chunk of chunks) {
      chunk.embedding = await llmClient.generateEmbedding(
        `${chunk.sectionTitle}: ${chunk.content}`,
        'search_document'
      );
    }

    // 4. Identify chapter and unit boundaries across chunks
    const chapters = this.detectChapters(chunks);

    // 5. Generate a quick initial document overview / executive summary
    const summary = this.generateQuickDocumentOverview(parsedDoc, chunks, chapters);

    const record: IngestedDocumentRecord = {
      documentId: parsedDoc.documentId,
      fileName: parsedDoc.fileName,
      mimeType: parsedDoc.mimeType,
      totalPages: parsedDoc.totalPages,
      totalChunks: chunks.length,
      totalChars: parsedDoc.totalChars,
      uploadedAt: new Date().toISOString(),
      summary,
      chapters,
      chunks,
    };

    this.documents.set(parsedDoc.documentId, record);
    if (parsedDoc.documentHash) {
      this.hashToRecordMap.set(parsedDoc.documentHash, record);
    }
    return record;
  }

  /**
   * Scans chunks to detect chapter/unit boundaries, titles, and page spans
   */
  private detectChapters(chunks: DocumentChunk[]): DocumentChapterInfo[] {
    const chapters: DocumentChapterInfo[] = [];
    const chapterRegex = /(?:chapter|unit)\s*([0-9]+|[ivxlcdm]+)\s*[:.-]?\s*([^\n\r]+)?/i;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const match = (chunk.sectionTitle + '\n' + chunk.content.slice(0, 300)).match(chapterRegex);

      if (match) {
        const rawNum = match[1];
        const num = this.parseChapterNumber(rawNum);
        const title = (match[2] || chunk.sectionTitle || `Chapter ${num}`).trim().slice(0, 80);

        const existing = chapters.find((c) => c.chapterNumber === num);
        if (!existing) {
          chapters.push({
            chapterNumber: num,
            chapterTitle: title,
            startPage: chunk.pageNumber,
            endPage: chunk.pageNumber,
            chunkIds: [chunk.id],
          });
        } else {
          existing.endPage = Math.max(existing.endPage, chunk.pageNumber);
          existing.chunkIds.push(chunk.id);
        }
      }
    }

    // Fill in end pages based on consecutive chapters if available
    for (let j = 0; j < chapters.length; j++) {
      if (j + 1 < chapters.length) {
        chapters[j].endPage = Math.max(chapters[j].startPage, chapters[j + 1].startPage - 1);
      }
    }

    return chapters;
  }

  private parseChapterNumber(raw: string): number {
    const n = parseInt(raw, 10);
    if (!isNaN(n)) return n;
    const map: Record<string, number> = {
      i: 1, one: 1,
      ii: 2, two: 2,
      iii: 3, three: 3,
      iv: 4, four: 4,
      v: 5, five: 5,
      vi: 6, six: 6,
      vii: 7, seven: 7,
      viii: 8, eight: 8,
      ix: 9, nine: 9,
      x: 10, ten: 10,
    };
    return map[raw.toLowerCase()] || 1;
  }

  /**
   * Retrieves an ingested document record by ID
   */
  getDocument(documentId: string): IngestedDocumentRecord | undefined {
    return this.documents.get(documentId);
  }

  /**
   * Lists all active ingested documents
   */
  listDocuments(): Omit<IngestedDocumentRecord, 'chunks'>[] {
    return Array.from(this.documents.values()).map((doc) => ({
      documentId: doc.documentId,
      fileName: doc.fileName,
      mimeType: doc.mimeType,
      totalPages: doc.totalPages,
      totalChunks: doc.totalChunks,
      totalChars: doc.totalChars,
      uploadedAt: doc.uploadedAt,
      summary: doc.summary,
      chapters: doc.chapters,
    }));
  }

  /**
   * Retrieves most relevant chunks from a specific document for a user question
   * using Reciprocal Rank Fusion (RRF) between Dense Vector Cosine & BM25 Keyword Scoring,
   * with Chapter-aware boundary expansion for tutoring questions.
   */
  async retrieveFromDocument(
    documentId: string,
    query: string,
    topK = 6
  ): Promise<ScoredDocumentChunk[]> {
    const doc = this.documents.get(documentId);
    if (!doc || doc.chunks.length === 0) {
      return [];
    }

    // 1. Detect if the user is asking about a specific chapter (e.g. "Chapter 1", "Unit 1")
    const chapterMatch = query.match(/(?:chapter|unit)\s*([0-9]+|[ivxlcdm]+|one|two|three|four|five|six|seven|eight|nine|ten)/i);
    const requestedChapterNum = chapterMatch ? this.parseChapterNumber(chapterMatch[1]) : null;

    // Detect if this is a deep tutoring or five-page request
    const isDeepTutoring = /(?:five|5)\s*pages|detailed|in-depth|teach me|lesson|lecture|comprehensive|explain\s+in\s+detail/i.test(query);

    // 2. If a specific chapter is requested, retrieve the entire chapter's sequence of chunks
    if (requestedChapterNum !== null) {
      const chapterInfo = doc.chapters.find((c) => c.chapterNumber === requestedChapterNum);
      
      let chapterChunks: DocumentChunk[] = [];
      if (chapterInfo && chapterInfo.chunkIds.length > 0) {
        const idSet = new Set(chapterInfo.chunkIds);
        chapterChunks = doc.chunks.filter((c) => idSet.has(c.id));
      } else {
        // Fallback: search by sectionTitle or page range
        const chapterKeywords = [`chapter ${requestedChapterNum}`, `unit ${requestedChapterNum}`, `chapter-${requestedChapterNum}`];
        chapterChunks = doc.chunks.filter((c) => {
          const lowerTitle = c.sectionTitle.toLowerCase();
          const lowerContent = c.content.slice(0, 200).toLowerCase();
          return chapterKeywords.some((kw) => lowerTitle.includes(kw) || lowerContent.includes(kw));
        });
      }

      // If chapter chunks found, expand to sequential sub-sections up to 20 chunks
      if (chapterChunks.length > 0) {
        // Find chunk index range
        const minIndex = Math.min(...chapterChunks.map((c) => c.chunkIndex));
        const maxIndex = Math.max(...chapterChunks.map((c) => c.chunkIndex));
        const extendedMax = Math.min(doc.chunks.length - 1, Math.max(maxIndex, minIndex + 18));
        
        const retrieved = doc.chunks.slice(minIndex, extendedMax + 1);
        return retrieved.map((chunk, idx) => ({
          chunk,
          vectorScore: 0.95 - idx * 0.01,
          keywordScore: 0.95,
          rrfScore: 0.95 - idx * 0.01,
        }));
      }
    }

    // 3. Standard Dense Vector + BM25 Hybrid Retrieval
    const effectiveTopK = isDeepTutoring ? Math.max(topK, 16) : topK;
    const queryVec = await llmClient.generateEmbedding(query, 'search_query');
    const queryTokens = this.tokenizeQuery(query);

    const scored: ScoredDocumentChunk[] = [];

    for (const chunk of doc.chunks) {
      const vectorScore = chunk.embedding
        ? llmClient.cosineSimilarity(queryVec, chunk.embedding)
        : 0;
      const keywordScore = this.computeKeywordScore(queryTokens, chunk);

      scored.push({
        chunk,
        vectorScore,
        keywordScore,
        rrfScore: 0,
      });
    }

    // Reciprocal Rank Fusion (RRF)
    const kConstant = 60;
    const byVector = [...scored].sort((a, b) => b.vectorScore - a.vectorScore);
    const vectorRanks = new Map<string, number>();
    byVector.forEach((item, index) => vectorRanks.set(item.chunk.id, index + 1));

    const byKeyword = [...scored].sort((a, b) => b.keywordScore - a.keywordScore);
    const keywordRanks = new Map<string, number>();
    byKeyword.forEach((item, index) => keywordRanks.set(item.chunk.id, index + 1));

    for (const item of scored) {
      const vRank = vectorRanks.get(item.chunk.id) || 999;
      const kRank = keywordRanks.get(item.chunk.id) || 999;
      item.rrfScore = (0.6 / (kConstant + vRank)) + (0.4 / (kConstant + kRank));

      if (item.chunk.charCount < 100) {
        item.rrfScore *= 0.1;
      }

      if (this.queryMentionsPageOrSection(query, item.chunk)) {
        item.rrfScore += 0.35;
      }
    }

    scored.sort((a, b) => b.rrfScore - a.rrfScore);

    const selected = scored.slice(0, effectiveTopK);
    const expanded = this.expandNeighboringContext(selected, doc.chunks, effectiveTopK);
    
    // Strict Document Identity Guard: assert every retrieved chunk strictly belongs to target documentId
    const verifiedChunks = expanded.filter((item) => item.chunk.documentId === documentId);
    console.log(
      `[Document Grounding Guard] Query: "${query.slice(0, 45)}" | Document ID: ${documentId} (${doc.fileName}) | Total Chunks Retrieved: ${verifiedChunks.length}`
    );
    return verifiedChunks;
  }

  /**
   * Enriches retrieved chunks with adjacent neighbors for natural sequential reading
   */
  private expandNeighboringContext(
    selected: ScoredDocumentChunk[],
    allChunks: DocumentChunk[],
    limit: number
  ): ScoredDocumentChunk[] {
    const includedIds = new Set(selected.map((s) => s.chunk.id));
    const result = [...selected];

    for (const item of selected) {
      const nextIndex = item.chunk.chunkIndex + 1;
      if (nextIndex < allChunks.length) {
        const nextChunk = allChunks[nextIndex];
        if (!includedIds.has(nextChunk.id) && result.length < limit + 4) {
          includedIds.add(nextChunk.id);
          result.push({
            chunk: nextChunk,
            vectorScore: item.vectorScore * 0.9,
            keywordScore: item.keywordScore * 0.9,
            rrfScore: item.rrfScore * 0.9,
          });
        }
      }
    }

    return result.sort((a, b) => a.chunk.chunkIndex - b.chunk.chunkIndex);
  }

  private tokenizeQuery(query: string): string[] {
    return query
      .toLowerCase()
      .replace(/[^a-z0-9\s_-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);
  }

  private computeKeywordScore(queryTokens: string[], chunk: DocumentChunk): number {
    if (!queryTokens.length) return 0;

    const contentLower = chunk.content.toLowerCase();
    const sectionLower = chunk.sectionTitle.toLowerCase();
    let matches = 0;

    for (const token of queryTokens) {
      if (contentLower.includes(token)) {
        matches += 1;
      }
      if (sectionLower.includes(token)) {
        matches += 2.5; // strong boost for title match
      }
    }

    return matches / (queryTokens.length * 2);
  }

  private queryMentionsPageOrSection(query: string, chunk: DocumentChunk): boolean {
    const q = query.toLowerCase();

    const pageRegex = new RegExp(`(?:page|p\\.?)\\s*${chunk.pageNumber}\\b`, 'i');
    if (pageRegex.test(q)) return true;

    const titleTokens = chunk.sectionTitle.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
    for (const token of titleTokens) {
      if (q.includes(token)) return true;
    }

    return false;
  }

  /**
   * Assesses section-by-section coverage for a chapter against retrieved chunks
   */
  getChapterCoverage(
    documentId: string,
    chapterNumber: number,
    retrievedChunks: DocumentChunk[]
  ): {
    chapterTitle: string;
    allSections: string[];
    coveredSections: string[];
    missingSections: string[];
    coverageRatio: number;
    isFullyCovered: boolean;
  } {
    const doc = this.documents.get(documentId);
    if (!doc) {
      return {
        chapterTitle: `Chapter ${chapterNumber}`,
        allSections: [],
        coveredSections: [],
        missingSections: [],
        coverageRatio: 1,
        isFullyCovered: true,
      };
    }

    const chapter = doc.chapters.find((c) => c.chapterNumber === chapterNumber);
    const chapterChunkIds = new Set(chapter?.chunkIds || []);
    const chapterAllChunks = doc.chunks.filter((c) => chapterChunkIds.has(c.id));

    const allSections = Array.from(new Set(chapterAllChunks.map((c) => c.sectionTitle))).filter(Boolean);
    const coveredChunkIds = new Set(retrievedChunks.map((c) => c.id));
    const coveredSections = Array.from(
      new Set(chapterAllChunks.filter((c) => coveredChunkIds.has(c.id)).map((c) => c.sectionTitle))
    ).filter(Boolean);

    const missingSections = allSections.filter((sec) => !coveredSections.includes(sec));
    const coverageRatio = allSections.length > 0 ? coveredSections.length / allSections.length : 1;

    return {
      chapterTitle: chapter?.chapterTitle || `Chapter ${chapterNumber}`,
      allSections,
      coveredSections,
      missingSections,
      coverageRatio,
      isFullyCovered: missingSections.length === 0,
    };
  }

  private generateQuickDocumentOverview(
    parsedDoc: ParsedDocument,
    chunks: DocumentChunk[],
    chapters: DocumentChapterInfo[]
  ): string {
    const chapterList = chapters.length > 0
      ? `\nIdentified Chapters (${chapters.length}):\n` + chapters.map((c) => `• Chapter ${c.chapterNumber}: ${c.chapterTitle} (Pages ${c.startPage}–${c.endPage})`).join('\n')
      : '';

    const previewSnippets = chunks
      .slice(0, 3)
      .map((c) => c.content.slice(0, 160) + '...')
      .join('\n');

    return `Document "${parsedDoc.fileName}" (${parsedDoc.totalPages} page${
      parsedDoc.totalPages > 1 ? 's' : ''
    }, ${chunks.length} chunks):${chapterList}\n\nPreview:\n${previewSnippets}`;
  }
}

export const documentRAGService = new DocumentRAGService();


