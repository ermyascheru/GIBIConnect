import type { Request, Response } from "express";
import { loginUser } from "../services/auth.service";
import { loginSchema } from "../validators/auth.validator";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware";

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const payload = await loginUser(email, password);

    res.json({
      success: true,
      data: payload,
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const getCurrentUserController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication token is required",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.json({
    success: true,
    data: {
      id: req.user.id,
      email: req.user.email,
      full_name: req.user.full_name,
      role: req.user.role,
      status: req.user.status,
    },
    timestamp: new Date().toISOString(),
  });
};
