import { Request, Response } from "express";
import {
  CreateStopSchema,
  ReorderStopsSchema,
} from "../validators/destination_stops.schema";
import { createUserClientFromAuthHeader } from "../lib/supabaseClients";
import {
  createStopService,
  reorderStopsService,
} from "../services/destination_stops.service";

export const createStop = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Missing Authorization header" });

  const supabase = createUserClientFromAuthHeader(authHeader);
  const parsed = CreateStopSchema.safeParse(req.body);

  if (!parsed.success)
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });

  try {
    const stop = await createStopService(supabase!, parsed.data);
    return res.status(201).json(stop);
  } catch (err: any) {
    return res
      .status(403)
      .json({ message: "Failed to create stop", error: err.message });
  }
};

export const reorderStops = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const supabase = createUserClientFromAuthHeader(authHeader);
  if (!supabase) {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }

  const parsed = ReorderStopsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    // Send only the 'updates' array to the service
    const result = await reorderStopsService(supabase, parsed.data.updates);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(403).json({
      message: "Failed to reorder stops",
      error: err.message,
    });
  }
};
