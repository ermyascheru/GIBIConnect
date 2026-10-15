import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { getUserById, getUsers } from "../services/user.service";
import { userParamsSchema, userQuerySchema } from "../validators/user.validator";

export const getUsersController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "moderator")) {
    res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "You do not have permission to list users",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const query = userQuerySchema.parse(req.query);
  const users = await getUsers(query);

  res.json({
    success: true,
    data: users,
    timestamp: new Date().toISOString(),
  });
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

  const user = await getUserById(req.user.id);

  if (!user) {
    res.status(404).json({
      success: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "User not found",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.json({
    success: true,
    data: user,
    timestamp: new Date().toISOString(),
  });
};

export const getUserByIdController = async (
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

  const { userId } = userParamsSchema.parse(req.params);
  const user = await getUserById(userId);

  if (!user) {
    res.status(404).json({
      success: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "User not found",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (req.user.id !== user.id && req.user.role !== "admin" && req.user.role !== "moderator") {
    res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "You do not have permission to access this user",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.json({
    success: true,
    data: user,
    timestamp: new Date().toISOString(),
  });
};
