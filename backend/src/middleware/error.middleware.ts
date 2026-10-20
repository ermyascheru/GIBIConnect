import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

const isMalformedJsonError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const bodyParserError = error as { status?: unknown; type?: unknown };

  return (
    bodyParserError.status === 400 &&
    bodyParserError.type === "entity.parse.failed"
  );
};

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (isMalformedJsonError(error)) {
    res.status(400).json({
      success: false,
      error: {
        code: "INVALID_JSON",
        message: "Malformed JSON request body",
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
    timestamp: new Date().toISOString(),
  });
};