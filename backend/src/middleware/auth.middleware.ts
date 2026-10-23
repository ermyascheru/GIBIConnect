import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthenticatedUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
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

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as {
      sub?: string;
      email?: string;
      role?: string;
      full_name?: string;
      status?: string;
    };

    if (!payload.sub || !payload.email) {
      throw new Error("Invalid token payload");
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      full_name: payload.full_name ?? "",
      role: payload.role ?? "user",
      status: payload.status ?? "active",
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "The provided token is invalid or expired",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const requireRole =
  (...allowedRoles: string[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication is required",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to access this resource",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
