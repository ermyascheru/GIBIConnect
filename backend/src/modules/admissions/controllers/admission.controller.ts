import type { Request, Response } from "express";
import {
  getAdmissionById,
  getAdmissions,
} from "../services/admission.service";
import {
  admissionParamsSchema,
  admissionQuerySchema,
} from "../validators/admission.validator";

export const getAdmissionsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = admissionQuerySchema.parse(req.query);
  const admissions = await getAdmissions(query);

  res.json({
    success: true,
    data: admissions,
    timestamp: new Date().toISOString(),
  });
};

export const getAdmissionByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { admissionId } = admissionParamsSchema.parse(req.params);
  const admission = await getAdmissionById(admissionId);

  if (!admission) {
    res.status(404).json({
      success: false,
      error: {
        code: "ADMISSION_NOT_FOUND",
        message: "Admission record not found",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.json({
    success: true,
    data: admission,
    timestamp: new Date().toISOString(),
  });
};
