import { Router } from "express";
import { requireAuth } from "../../../middleware/auth.middleware";

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

export default router;