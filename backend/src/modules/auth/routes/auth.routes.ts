import { Router } from "express";
import { requireAuth } from "../../../middleware/auth.middleware";
import {
  getCurrentUserController,
  loginController,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", loginController);
router.get("/me", requireAuth, getCurrentUserController);

export default router;
