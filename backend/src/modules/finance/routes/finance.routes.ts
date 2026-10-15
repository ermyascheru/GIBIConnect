import { Router } from "express";
import {
  getTuitionFeeByIdController,
  getTuitionFeesController,
} from "../controllers/finance.controller";

const router = Router();

router.get("/", getTuitionFeesController);
router.get("/:tuitionFeeId", getTuitionFeeByIdController);

export default router;
