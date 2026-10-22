import { Router } from "express";
import { requireAuth } from "../../../middleware/auth.middleware";

import multer from "multer";

import {
  advisorChatController,
  tutorLessonController,
  tutorQuizController,
  generateVisualController,
  uploadDocumentController,
} from "../controllers/ai.features.controller";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

import {
  chatController,
  listConversationsController,
  getConversationController,
  renameConversationController,
  deleteConversationController,
} from "../controllers/ai.controller";

const router = Router();

// Chat and conversation history require login.
router.post("/chat", requireAuth, chatController);
router.get("/conversations", requireAuth, listConversationsController);
router.get("/conversations/:id", requireAuth, getConversationController);
router.patch("/conversations/:id", requireAuth, renameConversationController);
router.delete("/conversations/:id", requireAuth, deleteConversationController);


// Additional AI features — login required
router.post("/advisor/chat", requireAuth, advisorChatController);

router.post("/tutor/lesson", requireAuth, tutorLessonController);
router.get("/tutor/quiz", requireAuth, tutorQuizController);

router.post("/visuals/generate", requireAuth, generateVisualController);

router.post(
  "/documents/upload",
  requireAuth,
  upload.single("file"),
  uploadDocumentController
);

export default router;