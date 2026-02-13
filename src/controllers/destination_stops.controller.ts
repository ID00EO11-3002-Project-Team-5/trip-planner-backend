import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  CreateStopSchema,
  ReorderStopsSchema,
} from "../validators/destination_stops.schema";
import {
  createStopService,
  reorderStopsService,
} from "../services/destination_stops.service";

export const createStop = async (req: AuthRequest, res: Response) => {
  const parsed = CreateStopSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const stop = await createStopService(req.supabase, parsed.data);
    return res.status(201).json(stop);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create stop";
    return res.status(500).json({
      message: "Failed to create stop",
      error: message,
    });
  }
};

export const reorderStops = async (req: AuthRequest, res: Response) => {
  const parsed = ReorderStopsSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const result = await reorderStopsService(req.supabase, parsed.data.updates);
    return res.status(200).json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to reorder stops";
    return res.status(500).json({
      message: "Failed to reorder stops",
      error: message,
    });
  }
};
