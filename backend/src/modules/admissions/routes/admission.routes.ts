import { Router } from "express";
import {
  getAdmissionByIdController,
  getAdmissionsController,
} from "../controllers/admission.controller";

const router = Router();

router.get("/", getAdmissionsController);
router.get("/:admissionId", getAdmissionByIdController);

export default router;
