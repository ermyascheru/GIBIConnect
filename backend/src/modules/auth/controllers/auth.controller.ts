import type { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";
import { loginSchema, registerSchema } from "../validators/auth.validator";
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
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: err.message === "INVALID_CREDENTIALS" ? "Invalid email or password" : (err.errors ? err.errors[0]?.message : "Invalid credentials format"),
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, fullName } = registerSchema.parse(req.body);
    const payload = await registerUser(email, password, fullName);

    res.status(201).json({
      success: true,
      data: payload,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    const isConflict = err.message === "EMAIL_ALREADY_EXISTS";
    res.status(isConflict ? 409 : 400).json({
      success: false,
      error: {
        code: isConflict ? "EMAIL_EXISTS" : "REGISTRATION_FAILED",
        message: isConflict ? "An account with this email address already exists" : (err.errors ? err.errors[0]?.message : "Registration failed. Please check your details."),
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
