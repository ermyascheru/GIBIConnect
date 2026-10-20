import { Router } from "express";
import {
  getResourceByIdController,
  getResourcesController,
} from "../controllers/resource.controller";

const router = Router();

router.get("/", getResourcesController);
router.get("/:resourceId", getResourceByIdController);

export default router;
