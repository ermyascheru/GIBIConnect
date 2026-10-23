/**
 * GIBIConnect — Document Chunking & Preparation Engine
 * Implements layout-, page-, and section-aware semantic chunking.
 * Preserves headings, formulas, tables, and sentence boundaries.
 */

import type { ParsedDocument, ExtractedPage } from './document.parser.js';

export interface DocumentChunk {
  id: string;
  documentId: string;
  fileName: string;
  chunkIndex: number;
  totalChunks: number;
  pageNumber: number;
  sectionTitle: string;
  content: string;
  charCount: number;
  keywords: string[];
  embedding?: number[];
}

export class DocumentChunkerService {
  private readonly TARGET_CHUNK_SIZE = 1400; // ~300 tokens
  private readonly OVERLAP_SIZE = 200; // ~40 tokens overlap for context preservation

  /**
   * Chunks a parsed document into structured, page-tracked, and section-labeled chunks.
   */
  chunkDocument(parsedDoc: ParsedDocument): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    let currentGlobalIndex = 0;

    for (const page of parsedDoc.pages) {
      const pageChunks = this.chunkPage(page, parsedDoc.documentId, parsedDoc.fileName);
      chunks.push(...pageChunks);
    }

    // Set totalChunks across all items and assign global indexes
    const total = chunks.length;
    for (let i = 0; i < total; i++) {
      chunks[i].chunkIndex = i;
      chunks[i].totalChunks = total;
    }

    return chunks;
  }

  /**
   * Chunks a single extracted page while preserving section headers, paragraphs, and lists.
   */
  private chunkPage(page: ExtractedPage, documentId: string, fileName: string): DocumentChunk[] {
    const text = page.text.trim();
    if (!text) return [];

    // If page is compact, keep it as a single chunk
    if (text.length <= this.TARGET_CHUNK_SIZE) {
      const sectionTitle = this.detectSectionTitle(text) || `Page ${page.pageNumber}`;
      return [
        {
          id: `${documentId}-p${page.pageNumber}-c0`,
          documentId,
          fileName,
          chunkIndex: 0,
          totalChunks: 1,
          pageNumber: page.pageNumber,
          sectionTitle,
          content: text,
          charCount: text.length,
          keywords: this.extractKeywords(text),
        },
      ];
    }

    // Split page text into semantic paragraphs or blocks
    const paragraphs = text.split(/\n\s*\n/);
    const pageChunks: DocumentChunk[] = [];
    let currentBlock = '';
    let currentSection = `Page ${page.pageNumber}`;
    let chunkSeq = 0;

    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i].trim();
      if (!para) continue;

      // Check for section title update
      const detected = this.detectSectionTitle(para);
      if (detected) {
        currentSection = detected;
      }

      // If adding this paragraph exceeds target size and currentBlock is non-empty, flush currentBlock
      if (currentBlock.length + para.length > this.TARGET_CHUNK_SIZE && currentBlock.length > 0) {
        pageChunks.push({
          id: `${documentId}-p${page.pageNumber}-c${chunkSeq++}`,
          documentId,
          fileName,
          chunkIndex: 0, // will be assigned globally
          totalChunks: 1,
          pageNumber: page.pageNumber,
          sectionTitle: currentSection,
          content: currentBlock.trim(),
          charCount: currentBlock.trim().length,
          keywords: this.extractKeywords(currentBlock),
        });

        // Sliding window overlap: carry over last portion of currentBlock
        const overlapSlice = this.extractOverlap(currentBlock, this.OVERLAP_SIZE);
        currentBlock = overlapSlice ? `${overlapSlice}\n\n${para}` : para;
      } else {
        currentBlock = currentBlock ? `${currentBlock}\n\n${para}` : para;
      }
    }

    // Flush any remaining text in currentBlock
    if (currentBlock.trim().length > 0) {
      pageChunks.push({
        id: `${documentId}-p${page.pageNumber}-c${chunkSeq++}`,
        documentId,
        fileName,
        chunkIndex: 0,
        totalChunks: 1,
        pageNumber: page.pageNumber,
        sectionTitle: currentSection,
        content: currentBlock.trim(),
        charCount: currentBlock.trim().length,
        keywords: this.extractKeywords(currentBlock),
      });
    }

    return pageChunks;
  }

  /**
   * Identifies prominent headings or topic labels at the start of a paragraph
   */
  private detectSectionTitle(paragraph: string): string | null {
    const lines = paragraph.split('\n');
    const firstLine = lines[0].trim();

    // Markdown headers (# Heading, ## Subheading)
    if (/^#{1,4}\s+(.+)$/.test(firstLine)) {
      return firstLine.replace(/^#{1,4}\s+/, '').slice(0, 80);
    }

    // Numbered sections (1. Introduction, 2.1 Methodology, Chapter 3)
    if (/^(?:Chapter|Section|Part|Module)\s+\d+[:.]?\s*(.*)$/i.test(firstLine)) {
      return firstLine.slice(0, 80);
    }
    if (/^\d+\.\d*(?:\.\d*)?\s+([A-Z].*)$/.test(firstLine)) {
      return firstLine.slice(0, 80);
    }

    // All-caps short heading lines (e.g., "COURSE OUTLINE", "EXECUTIVE SUMMARY")
    if (firstLine.length > 3 && firstLine.length < 60 && firstLine === firstLine.toUpperCase() && /^[A-Z0-9\s:_-]+$/.test(firstLine)) {
      return firstLine;
    }

    return null;
  }

  /**
   * Extracts clean overlap text that ends at a natural sentence or word boundary
   */
  private extractOverlap(text: string, targetSize: number): string {
    if (text.length <= targetSize) return text;
    const tail = text.slice(text.length - targetSize);
    const firstSentenceBreak = tail.search(/[.!?]\s+[A-Z]/);
    if (firstSentenceBreak !== -1) {
      return tail.slice(firstSentenceBreak + 2);
    }
    const firstSpace = tail.indexOf(' ');
    if (firstSpace !== -1) {
      return tail.slice(firstSpace + 1);
    }
    return tail;
  }

  /**
   * Extracts meaningful unigrams and bi-grams for keyword indexing
   */
  private extractKeywords(text: string): string[] {
    const stopWords = new Set([
      'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for', 'of',
      'with', 'as', 'by', 'this', 'that', 'it', 'from', 'or', 'are', 'be', 'were',
      'was', 'will', 'can', 'has', 'have', 'had', 'not', 'but', 'all', 'any'
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s_-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));

    const keywords = new Set<string>();
    for (let i = 0; i < words.length && keywords.size < 25; i++) {
      keywords.add(words[i]);
      if (i + 1 < words.length && keywords.size < 25) {
        keywords.add(`${words[i]} ${words[i + 1]}`);
      }
    }

    return Array.from(keywords);
  }
}

export const documentChunkerService = new DocumentChunkerService();
