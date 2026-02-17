import { Request, Response } from "express";
import {
  sendMessageService,
  getMessagesByTripService,
} from "../services/message.service";
import {
  SendMessageSchema,
  TripIdParamSchema,
} from "../validators/message.schema";

/**
 * Send Message
 * POST /messages/trips/:tripId
 */
export const sendMessage = async (
  req: Request<{ tripId: string }>,
  res: Response,
) => {
  if (!req.supabase || !req.user) {
    return res.status(401).json({
      message: "Unauthorized: Missing security context",
    });
  }

  const paramParsed = TripIdParamSchema.safeParse(req.params);
  const bodyParsed = SendMessageSchema.safeParse(req.body);

  if (!paramParsed.success) {
    return res.status(400).json({
      message: "Invalid tripId",
      errors: paramParsed.error.flatten(),
    });
  }

  if (!bodyParsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: bodyParsed.error.flatten(),
    });
  }

  try {
    const message = await sendMessageService(
      req.supabase,
      paramParsed.data.tripId,
      bodyParsed.data.content,
      req.user.id,
    );

    return res.status(201).json(message);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to send message";

    return res.status(400).json({
      message: "Failed to send message",
      error: errorMessage,
    });
  }
};

/**
 * Get Messages By Trip
 * GET /messages/trips/:tripId
 */
export const getMessagesByTrip = async (
  req: Request<{ tripId: string }>,
  res: Response,
) => {
  if (!req.supabase || !req.user) {
    return res.status(401).json({
      message: "Unauthorized: Missing security context",
    });
  }

  const paramParsed = TripIdParamSchema.safeParse(req.params);

  if (!paramParsed.success) {
    return res.status(400).json({
      message: "Invalid tripId",
      errors: paramParsed.error.flatten(),
    });
  }

  try {
    const messages = await getMessagesByTripService(
      req.supabase,
      paramParsed.data.tripId,
      req.user.id,
    );

    return res.status(200).json(messages);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch messages";

    return res.status(400).json({
      message: "Failed to fetch messages",
      error: errorMessage,
    });
  }
};
