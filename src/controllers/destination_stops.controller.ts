import { Request, Response } from "express";
import {
  CreateStopSchema,
  ReorderStopsSchema,
  TripIdParamSchema,
  StopIdParamSchema,
} from "../validators/destination_stops.schema";
import {
  createStopService,
  reorderStopsService,
  deleteStopService,
  getStopsByTripService,
} from "../services/destination_stops.service";

export const createStop = async (req: Request, res: Response) => {
  const parsed = CreateStopSchema.safeParse(req.body);

  if (!req.supabase) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing security context" });
  }

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

export const reorderStops = async (req: Request, res: Response) => {
  const parsed = ReorderStopsSchema.safeParse(req.body);

  if (!req.supabase) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing security context" });
  }

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

export const getStopsByTrip = async (req: Request, res: Response) => {
  const paramParsed = TripIdParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    return res.status(400).json({ errors: paramParsed.error.flatten() });
  }

  try {
    const stops = await getStopsByTripService(
      req.supabase!,
      paramParsed.data.tripId,
    );
    return res.status(200).json(stops);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal Server Error";
    return res
      .status(500)
      .json({ message: "Failed to fetch places", error: errorMessage });
  }
};

export const deleteStop = async (req: Request, res: Response) => {
  const paramParsed = StopIdParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    return res.status(400).json({ errors: paramParsed.error.flatten() });
  }

  try {
    await deleteStopService(req.supabase!, paramParsed.data.stopId);
    return res.status(200).json({ message: "Place removed from trip" });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal Server Error";
    return res
      .status(500)
      .json({ message: "Failed to delete place", error: errorMessage });
  }
};
