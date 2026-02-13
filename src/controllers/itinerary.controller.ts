import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  createItinerarySchema,
  reorderItinerarySchema,
} from "../validators/itinerary.schema";
import {
  createItineraryItemService,
  getTripScheduleService,
  reorderItineraryService,
  deleteItineraryItemService,
} from "../services/itinerary.service";

export const getTripSchedule = async (req: AuthRequest, res: Response) => {
  const tripId = req.params.tripId as string;

  try {
    // req.supabase is provided by protect middleware
    const schedule = await getTripScheduleService(req.supabase, tripId);
    return res.status(200).json(schedule);
  } catch (err: any) {
    return res.status(500).json({
      message: "Failed to fetch schedule",
      error: err.message,
    });
  }
};

export const reorderItinerary = async (req: AuthRequest, res: Response) => {
  const parsed = reorderItinerarySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const result = await reorderItineraryService(
      req.supabase,
      parsed.data.updates,
      parsed.data.tripId,
    );
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(403).json({
      message: "Reorder failed",
      error: err.message,
    });
  }
};

export const createItineraryItem = async (req: AuthRequest, res: Response) => {
  const parsed = createItinerarySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const item = await createItineraryItemService(req.supabase, parsed.data);
    return res.status(201).json(item);
  } catch (err: any) {
    return res.status(500).json({
      message: "Failed to create itinerary item",
      error: err.message,
    });
  }
};

export async function deleteItinerary(req: AuthRequest, res: Response) {
  const { itemId } = req.params as { itemId: string };

  try {
    const data = await deleteItineraryItemService(req.supabase, itemId);

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "Item not found or permission denied",
      });
    }

    return res.status(200).json({
      message: "Deleted successfully",
      data: data[0],
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return res.status(500).json({ error: message });
  }
}
