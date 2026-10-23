/**
 * GIBIConnect — Document Parsing & Text Extraction Engine
 * Supports: PDF (multi-page with page-number tracking), DOCX, TXT, Markdown, CSV, JSON.
 * Preserves page boundaries, headings, tables, mathematical formulas, and section context.
 */

import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import crypto from 'crypto';

export interface ExtractedPage {
  pageNumber: number;
  text: string;
  charCount: number;
}

export interface ParsedDocument {
  documentId: string;
  documentHash: string;
  fileName: string;
  mimeType: string;
  totalPages: number;
  totalChars: number;
  pages: ExtractedPage[];
  fullText: string;
  metadata: {
    author?: string;
    title?: string;
    createdAt?: string;
    fileSizeBytes: number;
  };
}

export class DocumentParserService {
  private readonly MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
  private parsedDocumentCache = new Map<string, ParsedDocument>();

  /**
   * Parses an uploaded file buffer into structured, page-tracked document data.
   */
  async parseBuffer(
    buffer: Buffer,
    fileName: string,
    mimeType?: string
  ): Promise<ParsedDocument> {
    if (!buffer || buffer.length === 0) {
      throw new Error('Document buffer is empty. Please provide a valid, non-empty file.');
    }

    if (buffer.length > this.MAX_FILE_SIZE) {
      throw new Error(
        `File size (${(buffer.length / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum limit of 25 MB.`
      );
    }

    const documentHash = crypto.createHash('sha256').update(buffer).digest('hex');
    const cached = this.parsedDocumentCache.get(documentHash);
    const documentId = `doc-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    if (cached) {
      return {
        ...cached,
        documentId,
        fileName, // Preserve latest filename
      };
    }
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    let parsed: ParsedDocument;
    // Route to appropriate parser based on file extension and MIME type
    if (extension === 'pdf' || mimeType === 'application/pdf') {
      parsed = await this.parsePdf(buffer, documentId, fileName, documentHash);
    } else if (
      extension === 'docx' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      parsed = await this.parseDocx(buffer, documentId, fileName, documentHash);
    } else if (
      extension === 'txt' ||
      extension === 'md' ||
      extension === 'csv' ||
      extension === 'json' ||
      mimeType?.startsWith('text/')
    ) {
      parsed = await this.parsePlainText(buffer, documentId, fileName, extension, documentHash);
    } else {
      throw new Error(
        `Unsupported file format ".${extension}". Supported formats: PDF (.pdf), Word (.docx), Plain Text (.txt), Markdown (.md), and CSV (.csv).`
      );
    }

    this.parsedDocumentCache.set(documentHash, parsed);
    return parsed;
  }

  /**
   * PDF Parser using pdf-parse with page-level text extraction and structural preservation
   */
  private async parsePdf(
    buffer: Buffer,
    documentId: string,
    fileName: string,
    documentHash: string
  ): Promise<ParsedDocument> {
    let parser: any;
    try {
      parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      const infoResult = await parser.getInfo().catch(() => ({}));

      const rawPages = textResult.pages || [];
      const pages: ExtractedPage[] = [];

      if (rawPages.length > 0) {
        for (let i = 0; i < rawPages.length; i++) {
          const rawPage = rawPages[i];
          const pageNum = rawPage.num || i + 1;
          const cleanedText = this.cleanExtractedText(rawPage.text || '');

          pages.push({
            pageNumber: pageNum,
            text: cleanedText,
            charCount: cleanedText.length,
          });
        }
      } else {
        // Fallback if pages array is not populated
        const fullCleaned = this.cleanExtractedText(textResult.text || '');
        pages.push({
          pageNumber: 1,
          text: fullCleaned,
          charCount: fullCleaned.length,
        });
      }

      const totalChars = pages.reduce((sum, p) => sum + p.charCount, 0);
      const fullText = pages.map((p) => `--- [Page ${p.pageNumber}] ---\n${p.text}`).join('\n\n');

      return {
        documentId,
        documentHash,
        fileName,
        mimeType: 'application/pdf',
        totalPages: pages.length,
        totalChars,
        pages,
        fullText,
        metadata: {
          author: infoResult?.info?.Author || undefined,
          title: infoResult?.info?.Title || fileName,
          createdAt: infoResult?.info?.CreationDate || new Date().toISOString(),
          fileSizeBytes: buffer.length,
        },
      };
    } catch (err: any) {
      if (err.name === 'PasswordException' || err.message?.includes('password')) {
        throw new Error('The attached PDF is password-protected or encrypted. Please provide an unencrypted document.');
      }
      throw new Error(`Failed to parse PDF "${fileName}": ${err.message || 'Corrupt or unreadable document.'}`);
    } finally {
      if (parser && typeof parser.destroy === 'function') {
        await parser.destroy().catch(() => {});
      }
    }
  }

  /**
   * DOCX Parser using mammoth to extract raw text and structural headings
   */
  private async parseDocx(
    buffer: Buffer,
    documentId: string,
    fileName: string,
    documentHash: string
  ): Promise<ParsedDocument> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const rawText = result.value || '';
      const cleaned = this.cleanExtractedText(rawText);

      // Approximate pages by splitting into ~2,500 characters per page if document is large
      const pageSize = 2500;
      const pages: ExtractedPage[] = [];

      if (cleaned.length <= pageSize) {
        pages.push({
          pageNumber: 1,
          text: cleaned,
          charCount: cleaned.length,
        });
      } else {
        const paragraphs = cleaned.split(/\n\s*\n/);
        let currentPage = 1;
        let currentText = '';

        for (const p of paragraphs) {
          if ((currentText.length + p.length > pageSize) && currentText.length > 0) {
            pages.push({
              pageNumber: currentPage++,
              text: currentText.trim(),
              charCount: currentText.trim().length,
            });
            currentText = p + '\n\n';
          } else {
            currentText += p + '\n\n';
          }
        }

        if (currentText.trim().length > 0) {
          pages.push({
            pageNumber: currentPage,
            text: currentText.trim(),
            charCount: currentText.trim().length,
          });
        }
      }

      const totalChars = pages.reduce((sum, p) => sum + p.charCount, 0);
      const fullText = pages.map((p) => `--- [Section / Page ${p.pageNumber}] ---\n${p.text}`).join('\n\n');

      return {
        documentId,
        documentHash,
        fileName,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        totalPages: pages.length,
        totalChars,
        pages,
        fullText,
        metadata: {
          title: fileName,
          createdAt: new Date().toISOString(),
          fileSizeBytes: buffer.length,
        },
      };
    } catch (err: any) {
      throw new Error(`Failed to parse Word document "${fileName}": ${err.message || 'Unreadable format.'}`);
    }
  }

  /**
   * Plain text / Markdown / CSV Parser
   */
  private async parsePlainText(
    buffer: Buffer,
    documentId: string,
    fileName: string,
    extension: string,
    documentHash: string
  ): Promise<ParsedDocument> {
    try {
      const raw = buffer.toString('utf-8');
      const cleaned = this.cleanExtractedText(raw);

      const pageSize = 3000;
      const pages: ExtractedPage[] = [];

      if (cleaned.length <= pageSize) {
        pages.push({
          pageNumber: 1,
          text: cleaned,
          charCount: cleaned.length,
        });
      } else {
        // Break along major section markers (#, ##, ---) or paragraphs
        const sections = cleaned.split(/(?=\n#{1,3}\s|\n---|\n===)/g);
        let currentPage = 1;
        let currentText = '';

        for (const sec of sections) {
          if ((currentText.length + sec.length > pageSize) && currentText.length > 0) {
            pages.push({
              pageNumber: currentPage++,
              text: currentText.trim(),
              charCount: currentText.trim().length,
            });
            currentText = sec;
          } else {
            currentText += sec;
          }
        }

        if (currentText.trim().length > 0) {
          pages.push({
            pageNumber: currentPage,
            text: currentText.trim(),
            charCount: currentText.trim().length,
          });
        }
      }

      const totalChars = pages.reduce((sum, p) => sum + p.charCount, 0);
      const fullText = pages.map((p) => `--- [Section ${p.pageNumber}] ---\n${p.text}`).join('\n\n');

      return {
        documentId,
        documentHash,
        fileName,
        mimeType: extension === 'md' ? 'text/markdown' : extension === 'csv' ? 'text/csv' : 'text/plain',
        totalPages: pages.length,
        totalChars,
        pages,
        fullText,
        metadata: {
          title: fileName,
          createdAt: new Date().toISOString(),
          fileSizeBytes: buffer.length,
        },
      };
    } catch (err: any) {
      throw new Error(`Failed to parse text document "${fileName}": ${err.message}`);
    }
  }

  /**
   * Normalizes text, removes null bytes, preserves and standardizes mathematical notation into LaTeX,
   * corrects OCR equation corruption (e.g. at^D -> \frac{1}{2}at^2), and strips injection delimiters.
   */
  private cleanExtractedText(text: string): string {
    let cleaned = text
      .replace(/\0/g, '') // strip null bytes
      .replace(/\r\n/g, '\n') // normalize newlines
      .replace(/[\t ]+/g, ' ') // condense redundant spaces
      .replace(/\n{3,}/g, '\n\n') // condense excessive blank lines
      // Strip potential prompt injection tags embedded in document text
      .replace(/<\/?(?:verified_context|system_instruction|system_prompt)>/gi, '');

    // Normalize mathematical formulas and equations into robust LaTeX representations
    cleaned = this.normalizeMathematicalNotation(cleaned);
    return cleaned.trim();
  }

  /**
   * Mathematical notation and equation preservation engine
   */
  private normalizeMathematicalNotation(text: string): string {
    return text
      // Fix kinematics equation OCR corruptions (e.g. at^D, at2, etc.)
      .replace(/(?:Delta\s*x|Δx)\s*=\s*(?:vi|v_i|v0|v_0)\s*\*?\s*t\s*\+\s*(?:1\/2|0\.5)\s*a\s*(?:t\^D|t\^d|t2|t\^2)/gi, 
        '\\[ \\Delta x = v_i t + \\frac{1}{2}at^2 \\]')
      .replace(/(?:vf|v_f)\s*\^?2\s*=\s*(?:vi|v_i|v0|v_0)\s*\^?2\s*\+\s*2\s*a\s*(?:Delta\s*x|Δx)/gi,
        '\\[ v_f^2 = v_i^2 + 2a\\Delta x \\]')
      .replace(/(?:vf|v_f)\s*=\s*(?:vi|v_i|v0|v_0)\s*\+\s*a\s*\*?\s*t/gi,
        '\\[ v_f = v_i + at \\]')
      // Vector notation standardizations
      .replace(/\b([A-Z])\s*=\s*([A-Z])_?x\s*\*?\s*i\s*\+\s*([A-Z])_?y\s*\*?\s*j(?:\s*\+\s*([A-Z])_?z\s*\*?\s*k)?/gi,
        (match, v, vx, vy, vz) => `\\[ \\vec{${v}} = ${vx}_x\\hat{i} + ${vy}_y\\hat{j}${vz ? ` + ${vz}_z\\hat{k}` : ''} \\]`)
      .replace(/\|([A-Z])\|\s*=\s*sqrt\(([^)]+)\)/gi, '\\[ |\\vec{$1}| = \\sqrt{$2} \\]')
      .replace(/theta\s*=\s*arctan\(([^)]+)\)/gi, '\\[ \\theta = \\arctan\\left($1\\right) \\]')
      // Units: m/s^2, m/s, cm^2, kg*m/s^2
      .replace(/\bm\/s2\b/g, '\\text{m/s}^2')
      .replace(/\bcm2\b/g, '\\text{cm}^2')
      .replace(/\bkg\*m\/s2\b/g, '\\text{kg}\\cdot\\text{m/s}^2');
  }
}

export const documentParserService = new DocumentParserService();
