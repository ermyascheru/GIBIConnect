import { Request, Response } from "express";
import { z } from "zod";

import type { AIChatRequest } from "../ai.types";
import { aiAdvisorService } from "../ai.advisor.service";
import { aiTutorService } from "../ai.tutor.service";
import { documentRAGService } from "../document.rag.service";
import { educationalImageGeneratorService } from "../image.generator.service";

function handleError(res: Response, error: unknown) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      message: "Invalid request.",
      errors: error.issues,
    });
  }

  console.error("AI feature error:", error);

  return res.status(500).json({
    message: "The AI feature could not complete the request.",
  });
}

const advisorSchema = z.object({
  message: z.string().trim().min(1).max(50000),
  mode: z.enum(["ADVISOR", "TUTOR"]).optional(),
  sessionId: z.string().optional(),
  documentId: z.string().optional(),
  attachedDocument: z.object({
    name: z.string(),
    data: z.string().optional(),
    mimeType: z.string().optional(),
  }).optional(),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).optional(),
  studentProfile: z.object({
    userId: z.string().optional(),
    stream: z.enum(["NATURAL", "SOCIAL"]).optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    region: z.string().optional(),
    eueeScore: z.number().optional(),
    targetUniversity: z.string().optional(),
    targetCourseCode: z.string().optional(),
  }).optional(),
});

export async function advisorChatController(
  req: Request,
  res: Response
) {
  try {
    const input = advisorSchema.parse(req.body);
    const result = await aiAdvisorService.processChat(
      input as AIChatRequest
    );

    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function tutorLessonController(
  req: Request,
  res: Response
) {
  try {
    const input = z.object({
      topic: z.string().trim().min(1).max(500),
      courseCode: z.string().optional(),
    }).parse(req.body);

    const lesson = await aiTutorService.buildStructuredTutorLesson(
      input.topic,
      input.courseCode
    );

    return res.json({ lesson });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function tutorQuizController(
  req: Request,
  res: Response
) {
  try {
    const courseCode = z.string().optional().parse(
      req.query.courseCode
    );

    const result = aiTutorService.getQuizAndFlashcards(courseCode);

    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function generateVisualController(
  req: Request,
  res: Response
) {
  try {
    const input = z.object({
      prompt: z.string().trim().min(1).max(2000),
      subject: z.enum([
        "MEDICINE",
        "BIOLOGY",
        "CHEMISTRY",
        "PHYSICS",
        "MATHEMATICS",
        "ENGINEERING",
        "COMPUTER_SCIENCE",
      ]).optional(),
      style: z.enum([
        "diagram",
        "schematic",
        "illustration",
        "cross-section",
        "flowchart",
        "mindmap",
        "render",
      ]).optional(),
      aspectRatio: z.enum(["1:1", "16:9", "4:3"]).optional(),
    }).parse(req.body);

    const visual =
      await educationalImageGeneratorService.generateImage(input);

    return res.json({ visual });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function uploadDocumentController(
  req: Request,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Attach a file using the form field "file".',
      });
    }

    const document = await documentRAGService.ingestDocumentBuffer(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const { chunks, ...documentInfo } = document;

    return res.status(201).json({
      document: documentInfo,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
