import type { Request, Response } from "express";
import {
  getResourceById,
  getResources,
} from "../services/resource.service";
import {
  resourceParamsSchema,
  resourceQuerySchema,
} from "../validators/resource.validator";

export const getResourcesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = resourceQuerySchema.parse(req.query);
  const resources = await getResources(query);

  res.json({
    success: true,
    data: resources,
    timestamp: new Date().toISOString(),
  });
};

export const getResourceByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { resourceId } = resourceParamsSchema.parse(req.params);
  const resource = await getResourceById(resourceId);

  if (!resource) {
    res.status(404).json({
      success: false,
      error: {
        code: "RESOURCE_NOT_FOUND",
        message: "Resource not found",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.json({
    success: true,
    data: resource,
    timestamp: new Date().toISOString(),
  });
};
