import { Router } from "express";
import {
  getProgramByIdController,
  getProgramsController,
} from "../controllers/program.controller";

const router = Router();

router.get("/", getProgramsController);
router.get("/:programId", getProgramByIdController);

export default router;
