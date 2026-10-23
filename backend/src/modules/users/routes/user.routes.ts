import { Router } from "express";
import { requireAuth } from "../../../middleware/auth.middleware";
import {
  getCurrentUserController,
  getUserByIdController,
  getUsersController,
  getBookmarksController,
  addBookmarkController,
  removeBookmarkController,
} from "../controllers/user.controller";

const router = Router();

router.get("/me", requireAuth, getCurrentUserController);
router.get("/me/bookmarks", requireAuth, getBookmarksController);
router.post("/me/bookmarks", requireAuth, addBookmarkController);
router.delete("/me/bookmarks", requireAuth, removeBookmarkController);

router.get("/", requireAuth, getUsersController);
router.get("/:userId", requireAuth, getUserByIdController);

export default router;
