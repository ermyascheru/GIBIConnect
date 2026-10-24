import { Router } from "express";
import { requireAuth } from "../../../middleware/auth.middleware";
import {
  getCurrentUserController,
  loginController,
  registerController,
  googleAuthController,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/google", googleAuthController);
router.get("/me", requireAuth, getCurrentUserController);

export default router;
