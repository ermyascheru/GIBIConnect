import type { Request, Response } from "express";
import {
  financeParamsSchema,
  financeQuerySchema,
} from "../validators/finance.validator";
import {
  getTuitionFeeById,
  getTuitionFees,
} from "../services/finance.service";

export const getTuitionFeesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = financeQuerySchema.parse(req.query);
  const tuitionFees = await getTuitionFees(query);

  res.json({
    success: true,
    data: tuitionFees,
    timestamp: new Date().toISOString(),
  });
};

export const getTuitionFeeByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { tuitionFeeId } = financeParamsSchema.parse(req.params);
  const tuitionFee = await getTuitionFeeById(tuitionFeeId);

  if (!tuitionFee) {
    res.status(404).json({
      success: false,
      error: {
        code: "TUITION_FEE_NOT_FOUND",
        message: "Tuition fee record not found",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.json({
    success: true,
    data: tuitionFee,
    timestamp: new Date().toISOString(),
  });
};
