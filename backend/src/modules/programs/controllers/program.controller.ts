import type { Request, Response } from "express";
import { getProgramById, getPrograms } from "../services/program.service";
import {
  programParamsSchema,
  programQuerySchema,
} from "../validators/program.validator";

export const getProgramsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = programQuerySchema.parse(req.query);
  const programs = await getPrograms(query);

  res.json({
    success: true,
    data: programs,
    timestamp: new Date().toISOString(),
  });
};

export const getProgramByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { programId } = programParamsSchema.parse(req.params);
  const program = await getProgramById(programId);

  if (!program) {
    res.status(404).json({
      success: false,
      error: {
        code: "PROGRAM_NOT_FOUND",
        message: "Program not found",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.json({
    success: true,
    data: program,
    timestamp: new Date().toISOString(),
  });
};
