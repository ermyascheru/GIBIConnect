import { Router } from "express";
import {
	getInstitutionByIdController,
	getInstitutionsController,
} from "../controllers/institution.controller";

const router = Router();

router.get("/", getInstitutionsController);
router.get("/:institutionId", getInstitutionByIdController);

export default router;