import { Request, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { aiService } from "../services/ai.service";

const chatSchema = z.object({
  message: z.string().trim().min(1).max(50000),
  sessionId: z.string().uuid().optional(),
});

const conversationIdSchema = z.string().uuid();

const titleSchema = z.object({
  title: z.string().trim().min(1).max(255),
});

function userIdFrom(req: Request): string {
  return (req as AuthenticatedRequest).user!.id;
}

function handleError(res: Response, error: unknown) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      message: "Invalid request.",
      errors: error.issues,
    });
  }

  if (
    error instanceof Error &&
    error.message === "CONVERSATION_NOT_FOUND"
  ) {
    return res.status(404).json({
      message: "Conversation not found.",
    });
  }

  console.error("AI API error:", error);

  return res.status(500).json({
    message: "The AI request could not be completed.",
  });
}

export async function chatController(req: Request, res: Response) {
  try {
    const input = chatSchema.parse(req.body);
    const result = await aiService.chat(
      userIdFrom(req),
      input.message,
      input.sessionId
    );

    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function listConversationsController(
  req: Request,
  res: Response
) {
  try {
    const conversations = await aiService.listConversations(userIdFrom(req));
    return res.json({ conversations });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getConversationController(
  req: Request,
  res: Response
) {
  try {
    const id = conversationIdSchema.parse(req.params.id);
    const conversation = await aiService.getConversation(
      userIdFrom(req),
      id
    );

    return res.json({ conversation });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function renameConversationController(
  req: Request,
  res: Response
) {
  try {
    const id = conversationIdSchema.parse(req.params.id);
    const { title } = titleSchema.parse(req.body);

    const conversation = await aiService.renameConversation(
      userIdFrom(req),
      id,
      title
    );

    return res.json({ conversation });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function deleteConversationController(
  req: Request,
  res: Response
) {
  try {
    const id = conversationIdSchema.parse(req.params.id);
    const result = await aiService.deleteConversation(userIdFrom(req), id);

    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
}