import { Router } from "express";
import { requireAuth } from "../../../middleware/auth.middleware";
import {
  getCurrentUserController,
  getUserByIdController,
  getUsersController,
} from "../controllers/user.controller";

const router = Router();

router.get("/me", requireAuth, getCurrentUserController);
router.get("/", requireAuth, getUsersController);
router.get("/:userId", requireAuth, getUserByIdController);

export default router;
