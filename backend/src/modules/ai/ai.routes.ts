/**
 * GIBIConnect — AI Advisor, Hybrid RAG, Document Analysis & 6-Stage AI Tutor Router
 * Mounted at /api/v1/ai
 */

import express from 'express';
import multer from 'multer';
import { aiController } from './ai.controller.js';

export const aiRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

// 1. Health & RAG Corpus Status
aiRouter.get('/health', (req, res) => aiController.getHealth(req, res));

// 2. Hybrid RAG Chat (Advisor, Document Analysis & Tutor Modes)
aiRouter.post('/chat', (req, res) => aiController.handleChat(req, res));

// 3. Server-Sent Events (SSE) Streaming Chat
aiRouter.post('/chat/stream', (req, res) => aiController.handleChatStream(req, res));

// 4. Document Upload, Parsing & Scoped RAG Ingestion
aiRouter.post('/document/upload', upload.single('file'), (req, res) =>
  aiController.handleUploadDocument(req, res)
);
aiRouter.get('/documents', (req, res) => aiController.handleListDocuments(req, res));
aiRouter.get('/document/:id', (req, res) => aiController.handleGetDocument(req, res));

// 5. Hybrid Retrieval & RRF Inspector
aiRouter.post('/retrieve', (req, res) => aiController.handleRetrieve(req, res));

// 6. Dynamic VERIFIED Chunk Ingestion
aiRouter.post('/ingest', (req, res) => aiController.handleIngestChunk(req, res));

// 7. 6-Stage AI Tutor Endpoints (Explain -> Show -> Simulate -> Practice -> Feedback -> Adapt)
aiRouter.post('/tutor/lesson', (req, res) => aiController.handleTutorLesson(req, res));
aiRouter.get('/tutor/quiz', (req, res) => aiController.handleTutorQuiz(req, res));
aiRouter.post('/tutor/evaluate', (req, res) => aiController.handleTutorEvaluate(req, res));

// 8. Persistent Conversations & Chat History
aiRouter.get('/conversations', (req, res) => aiController.handleListConversations(req, res));
aiRouter.get('/conversations/:id', (req, res) => aiController.handleGetConversation(req, res));
aiRouter.post('/conversations', (req, res) => aiController.handleCreateConversation(req, res));
aiRouter.patch('/conversations/:id', (req, res) => aiController.handleUpdateConversation(req, res));
aiRouter.delete('/conversations/:id', (req, res) => aiController.handleDeleteConversation(req, res));

// 9. Subject-Specific Educational Visual & Diagram Generation
aiRouter.post('/image/generate', (req, res) => aiController.handleGenerateImage(req, res));
