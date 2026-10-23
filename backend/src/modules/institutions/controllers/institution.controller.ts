import { Request, Response } from "express";
import {
  getInstitutionById,
  getInstitutions,
} from "../services/institution.service";
import {
  institutionParamsSchema,
  institutionQuerySchema,
} from "../validators/institution.validator";

export const getInstitutionsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = institutionQuerySchema.parse(req.query);

  const institutions = await getInstitutions(query);

  res.json({
    success: true,
    data: institutions,
    timestamp: new Date().toISOString(),
  });
};

export const getInstitutionByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { institutionId } = institutionParamsSchema.parse(req.params);
  const institution = await getInstitutionById(institutionId);

  if (!institution) {
    res.status(404).json({
      success: false,
      error: {
        code: "INSTITUTION_NOT_FOUND",
        message: "Institution not found",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.json({
    success: true,
    data: institution,
    timestamp: new Date().toISOString(),
  });
};