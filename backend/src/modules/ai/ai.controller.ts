/**
 * GIBIConnect — AI & Hybrid RAG & Adaptive Tutor Controller
 * Strictly parses HTTP requests, validates DTOs with Zod, and returns standardized JSON envelopes.
 */

import type { Request, Response } from 'express';
import { z } from 'zod';
import { aiAdvisorService } from './ai.advisor.service.js';
import { aiTutorService } from './ai.tutor.service.js';
import { ragRetriever } from './rag.retriever.js';
import { documentRAGService } from './document.rag.service.js';
import { educationalImageGeneratorService } from './image.generator.service.js';
import pool from '../../config/database.js';

const imageGenerateSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000),
  subject: z
    .enum(['MEDICINE', 'BIOLOGY', 'CHEMISTRY', 'PHYSICS', 'MATHEMATICS', 'ENGINEERING', 'COMPUTER_SCIENCE'])
    .optional(),
  style: z.enum(['diagram', 'illustration', 'mindmap', 'render']).optional(),
  aspectRatio: z.enum(['1:1', '16:9', '4:3']).optional(),
  conversationId: z.string().optional(),
});

const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(50000),
  mode: z.enum(['ADVISOR', 'TUTOR']).optional(),
  sessionId: z.string().optional(),
  documentId: z.string().optional(),
  attachedDocument: z
    .object({
      name: z.string(),
      data: z.string().optional(),
      mimeType: z.string().optional(),
    })
    .optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional(),
  studentProfile: z
    .object({
      userId: z.string().optional(),
      stream: z.enum(['NATURAL', 'SOCIAL']).optional(),
      gender: z.enum(['MALE', 'FEMALE']).optional(),
      region: z.string().optional(),
      eueeScore: z.number().min(0).max(700).optional(),
      targetUniversity: z.string().optional(),
      targetCourseCode: z.string().optional(),
    })
    .optional(),
});

const retrieveRequestSchema = z.object({
  query: z.string().min(1).max(1000),
  topK: z.number().int().min(1).max(10).optional().default(4),
});

const tutorLessonSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  courseCode: z.string().optional(),
});

const tutorEvaluateSchema = z.object({
  userId: z.string().optional(),
  questionId: z.string().min(1),
  selectedOptionIndex: z.number().int().min(0).max(3),
});

const ingestChunkSchema = z.object({
  institutionCode: z.string().optional(),
  courseCode: z.string().optional(),
  domain: z
    .enum([
      'ADMISSIONS',
      'PROCLAMATION_FINANCE',
      'UNIVERSITY_CATALOG',
      'SYLLABUS_CURRICULUM',
      'FRESHMAN_COURSE',
      'EUEE_PAST_EXAM',
    ])
    .default('UNIVERSITY_CATALOG'),
  sourceTitle: z.string().min(3),
  pageNumber: z.number().int().min(1).default(1),
  academicYear: z.string().default('2016/2017 E.C.'),
  content: z.string().min(10),
  keywords: z.array(z.string()).default([]),
});

export class AIController {
  /**
   * GET /api/v1/ai/health
   */
  async getHealth(_req: Request, res: Response) {
    await ragRetriever.ensureCorpusIndexed();
    const stats = ragRetriever.getCorpusStats();

    res.json({
      success: true,
      data: {
        status: 'operational',
        engine: 'GIBIConnect 3-Tier Hybrid RAG & 6-Stage Adaptive AI Tutor',
        embeddingDimensions: 768,
        rankingAlgorithm: 'Reciprocal Rank Fusion (0.6 Vector Cosine + 0.4 BM25 Full-Text + Exact Code Boost)',
        trustFilter: 'VERIFIED_ONLY',
        corpus: stats,
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * POST /api/v1/ai/chat
   */
  async handleChat(req: Request, res: Response) {
    try {
      const parsed = chatRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(422).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid AI chat request payload',
            details: parsed.error.issues,
          },
        });
      }

      const responseData = await aiAdvisorService.processChat(parsed.data);

      // Persist conversation and messages to PostgreSQL ai_conversations and ai_messages
      try {
        let conversationId = parsed.data.sessionId;
        const isUuid = !!conversationId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(conversationId);
        
        if (isUuid) {
          const convCheck = await pool.query('SELECT id FROM public.ai_conversations WHERE id = $1', [conversationId]);
          if (convCheck.rows.length === 0) {
            await pool.query(
              'INSERT INTO public.ai_conversations (id, title, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())',
              [conversationId, parsed.data.message.slice(0, 80)]
            );
          } else {
            await pool.query('UPDATE public.ai_conversations SET updated_at = NOW() WHERE id = $1', [conversationId]);
          }

          // Save user message
          await pool.query(
            'INSERT INTO public.ai_messages (conversation_id, role, content, created_at) VALUES ($1, $2, $3, NOW())',
            [conversationId, 'user', parsed.data.message]
          );

          // Save AI response
          await pool.query(
            'INSERT INTO public.ai_messages (conversation_id, role, content, retrieved_context, created_at) VALUES ($1, $2, $3, $4, NOW())',
            [
              conversationId,
              'assistant',
              responseData.reply,
              JSON.stringify({
                citations: responseData.citations || [],
                visual: responseData.visual,
                documentContext: responseData.documentContext,
              }),
            ]
          );
        }
      } catch (dbErr) {
        console.warn('Conversation DB persistence notice:', dbErr);
      }

      return res.json({
        success: true,
        data: responseData,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'AI_INFERENCE_ERROR',
          message: error.message || 'Failed to process AI advisory request',
        },
      });
    }
  }

  /**
   * POST /api/v1/ai/chat/stream
   */
  async handleChatStream(req: Request, res: Response) {
    const parsed = chatRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_FAILED',
          details: parsed.error.issues,
        },
      });
    }

    await aiAdvisorService.streamGroundedAdvisory(parsed.data, res);
  }

  /**
   * POST /api/v1/ai/retrieve
   * Diagnostic endpoint to inspect top-K hybrid RAG chunks & RRF scores
   */
  async handleRetrieve(req: Request, res: Response) {
    const parsed = retrieveRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_FAILED', details: parsed.error.issues },
      });
    }

    const chunks = await ragRetriever.retrieveTopK(parsed.data.query, parsed.data.topK);
    return res.json({
      success: true,
      data: {
        query: parsed.data.query,
        intent: ragRetriever.classifyQueryIntent(parsed.data.query),
        results: chunks.map((c) => ({
          id: c.chunk.id,
          sourceTitle: c.chunk.sourceTitle,
          pageNumber: c.chunk.pageNumber,
          institutionCode: c.chunk.institutionCode,
          courseCode: c.chunk.courseCode,
          domain: c.chunk.domain,
          verificationStatus: c.chunk.verificationStatus,
          scores: {
            rrfScore: c.rrfScore,
            vectorScore: Number(c.vectorScore.toFixed(4)),
            fullTextScore: Number(c.fullTextScore.toFixed(4)),
            structuredBonus: c.structuredBonus,
          },
          contentPreview: c.chunk.content,
        })),
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * POST /api/v1/ai/tutor/lesson
   * Generates a complete 6-Stage AI Tutor Lesson (Explain -> Show -> Simulate -> Practice)
   */
  async handleTutorLesson(req: Request, res: Response) {
    const parsed = tutorLessonSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_FAILED', details: parsed.error.issues },
      });
    }

    const lesson = await aiTutorService.buildStructuredTutorLesson(
      parsed.data.topic,
      parsed.data.courseCode
    );

    return res.json({
      success: true,
      data: lesson,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * GET /api/v1/ai/tutor/quiz?courseCode=MATH1011
   */
  async handleTutorQuiz(req: Request, res: Response) {
    const courseCode = req.query.courseCode ? String(req.query.courseCode) : undefined;
    const quizBundle = aiTutorService.getQuizAndFlashcards(courseCode);

    return res.json({
      success: true,
      data: quizBundle,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * POST /api/v1/ai/tutor/evaluate
   * Grades a student's quiz response, returns Socratic feedback, and adapts mastery score
   */
  async handleTutorEvaluate(req: Request, res: Response) {
    const parsed = tutorEvaluateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_FAILED', details: parsed.error.issues },
      });
    }

    const evaluation = aiTutorService.evaluateAnswerAndAdapt(parsed.data);
    return res.json({
      success: true,
      data: evaluation,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * POST /api/v1/ai/ingest
   * Adds a new VERIFIED document chunk into the 768-dim RAG index
   */
  async handleIngestChunk(req: Request, res: Response) {
    const parsed = ingestChunkSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_FAILED', details: parsed.error.issues },
      });
    }

    const created = await ragRetriever.ingestDocumentChunk({
      id: `chunk-custom-${Date.now()}`,
      chunkIndex: 1,
      verificationStatus: 'VERIFIED',
      ...parsed.data,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: created.id,
        sourceTitle: created.sourceTitle,
        embeddingDimension: created.embedding?.length ?? 768,
        verificationStatus: created.verificationStatus,
      },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * POST /api/v1/ai/document/upload
   * Accepts multipart file upload or base64 JSON payload, parses into page-tracked units,
   * generates 768-dim embeddings, and registers document for grounded RAG chat.
   */
  async handleUploadDocument(req: Request, res: Response) {
    try {
      let fileBuffer: Buffer | null = null;
      let fileName = 'uploaded_document';
      let mimeType = 'application/octet-stream';

      if (req.file) {
        fileBuffer = req.file.buffer;
        fileName = req.file.originalname;
        mimeType = req.file.mimetype;
      } else if (req.body.fileData) {
        const base64Data = req.body.fileData.replace(/^data:[^;]+;base64,/, '');
        fileBuffer = Buffer.from(base64Data, 'base64');
        fileName = req.body.fileName || 'uploaded_document.pdf';
        mimeType = req.body.mimeType || 'application/pdf';
      }

      if (!fileBuffer || fileBuffer.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'NO_FILE_PROVIDED',
            message: 'No file buffer provided. Please attach a valid PDF, DOCX, TXT, MD, or CSV file.',
          },
        });
      }

      const ingested = await documentRAGService.ingestDocumentBuffer(
        fileBuffer,
        fileName,
        mimeType
      );

      return res.status(201).json({
        success: true,
        data: {
          documentId: ingested.documentId,
          fileName: ingested.fileName,
          mimeType: ingested.mimeType,
          totalPages: ingested.totalPages,
          totalChunks: ingested.totalChunks,
          totalChars: ingested.totalChars,
          uploadedAt: ingested.uploadedAt,
          summary: ingested.summary,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DOCUMENT_PROCESSING_ERROR',
          message: err.message || 'Failed to process document',
        },
      });
    }
  }

  /**
   * GET /api/v1/ai/document/:id
   */
  async handleGetDocument(req: Request, res: Response) {
    const docId = req.params.id;
    const doc = documentRAGService.getDocument(docId);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: { code: 'DOCUMENT_NOT_FOUND', message: 'Document not found or session expired.' },
      });
    }
    return res.json({
      success: true,
      data: {
        documentId: doc.documentId,
        fileName: doc.fileName,
        mimeType: doc.mimeType,
        totalPages: doc.totalPages,
        totalChunks: doc.totalChunks,
        totalChars: doc.totalChars,
        uploadedAt: doc.uploadedAt,
        summary: doc.summary,
      },
    });
  }

  /**
   * GET /api/v1/ai/documents
   */
  async handleListDocuments(_req: Request, res: Response) {
    const docs = documentRAGService.listDocuments();
    return res.json({
      success: true,
      data: docs,
    });
  }

  /**
   * GET /api/v1/ai/conversations
   */
  async handleListConversations(_req: Request, res: Response) {
    try {
      const result = await pool.query(`
        SELECT c.id, c.title, c.created_at, c.updated_at,
          (SELECT content FROM public.ai_messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
          (SELECT COUNT(*)::int FROM public.ai_messages m WHERE m.conversation_id = c.id) as message_count
        FROM public.ai_conversations c
        ORDER BY c.updated_at DESC
        LIMIT 50
      `);

      return res.json({
        success: true,
        data: result.rows,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DATABASE_ERROR', message: err.message },
      });
    }
  }

  /**
   * GET /api/v1/ai/conversations/:id
   */
  async handleGetConversation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const convRes = await pool.query('SELECT * FROM public.ai_conversations WHERE id = $1', [id]);
      if (convRes.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Conversation not found' },
        });
      }

      const msgRes = await pool.query(
        'SELECT id, role, content, retrieved_context, created_at FROM public.ai_messages WHERE conversation_id = $1 ORDER BY created_at ASC',
        [id]
      );

      return res.json({
        success: true,
        data: {
          conversation: convRes.rows[0],
          messages: msgRes.rows,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DATABASE_ERROR', message: err.message },
      });
    }
  }

  /**
   * POST /api/v1/ai/conversations
   */
  async handleCreateConversation(req: Request, res: Response) {
    try {
      const title = req.body.title || 'New Academic Consultation';
      const result = await pool.query(
        'INSERT INTO public.ai_conversations (title, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING *',
        [title]
      );

      return res.status(201).json({
        success: true,
        data: result.rows[0],
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DATABASE_ERROR', message: err.message },
      });
    }
  }

  /**
   * DELETE /api/v1/ai/conversations/:id
   */
  async handleDeleteConversation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      if (!isUuid) {
        return res.json({
          success: true,
          data: { id, deleted: true, note: 'Client session cleared' },
          timestamp: new Date().toISOString(),
        });
      }

      await pool.query('DELETE FROM public.ai_messages WHERE conversation_id = $1', [id]);
      await pool.query('DELETE FROM public.ai_conversations WHERE id = $1', [id]);

      return res.json({
        success: true,
        data: { id, deleted: true },
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DATABASE_ERROR', message: err.message },
      });
    }
  }

  /**
   * PATCH /api/v1/ai/conversations/:id
   * Updates conversation title or metadata
   */
  async handleUpdateConversation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      if (!title || typeof title !== 'string') {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_TITLE', message: 'Valid title string is required' },
        });
      }

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      if (!isUuid) {
        return res.json({
          success: true,
          data: { id, title: title.trim().slice(0, 100), note: 'Client session updated' },
          timestamp: new Date().toISOString(),
        });
      }

      const result = await pool.query(
        'UPDATE public.ai_conversations SET title = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [title.trim().slice(0, 100), id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Conversation not found' },
        });
      }

      return res.json({
        success: true,
        data: result.rows[0],
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'DATABASE_ERROR', message: err.message },
      });
    }
  }

  /**
   * POST /api/v1/ai/image/generate
   * Generates subject-specific educational diagrams, illustrations, and schematics
   */
  async handleGenerateImage(req: Request, res: Response) {
    try {
      const parsed = imageGenerateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_REQUEST', message: parsed.error.errors[0]?.message || 'Invalid payload' },
        });
      }

      const result = await educationalImageGeneratorService.generateImage(parsed.data);

      // If conversationId is provided, persist messages to PostgreSQL ai_conversations and ai_messages
      if (parsed.data.conversationId) {
        try {
          const conversationId = parsed.data.conversationId;
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(conversationId);
          if (isUuid) {
            const convCheck = await pool.query('SELECT id FROM public.ai_conversations WHERE id = $1', [conversationId]);
            if (convCheck.rows.length === 0) {
              await pool.query(
                'INSERT INTO public.ai_conversations (id, title, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())',
                [conversationId, `Visual: ${result.title}`]
              );
            } else {
              await pool.query('UPDATE public.ai_conversations SET updated_at = NOW() WHERE id = $1', [conversationId]);
            }

            // Save user visual prompt
            await pool.query(
              'INSERT INTO public.ai_messages (conversation_id, role, content, created_at) VALUES ($1, $2, $3, NOW())',
              [conversationId, 'user', `Generate visual diagram: ${parsed.data.prompt}`]
            );

            // Save assistant visual description & metadata
            const formattedContent = `[Generated Visual: ${result.title}]\n${result.description}\n\nKey Concepts: ${result.keyConcepts.join(', ')}`;
            await pool.query(
              'INSERT INTO public.ai_messages (conversation_id, role, content, created_at) VALUES ($1, $2, $3, NOW())',
              [conversationId, 'assistant', formattedContent]
            );
          }
        } catch (err: any) {
          console.warn('[ImagePersistence] Failed to persist visual to db:', err.message);
        }
      }

      return res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: { code: 'GENERATION_ERROR', message: err.message },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const aiController = new AIController();
