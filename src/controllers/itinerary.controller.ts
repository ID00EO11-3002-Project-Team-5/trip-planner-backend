import { Request, Response } from "express";
import { SupabaseClient } from '@supabase/supabase-js';
import {
  createItinerarySchema,
  reorderItinerarySchema,
} from "../validators/itinerary.schema";
import { createUserClientFromAuthHeader } from "../lib/supabaseClients";
import {
  createItineraryItemService,
  getTripScheduleService,
  reorderItineraryService,
  deleteItineraryItemService,
} from "../services/itinerary.service";


interface AuthenticatedRequest extends Request {
  supabase: SupabaseClient;
}

export const getTripSchedule = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const tripId = Array.isArray(req.params.tripId)
    ? req.params.tripId[0]
    : req.params.tripId;

  const supabase = createUserClientFromAuthHeader(authHeader!);
  try {
    const schedule = await getTripScheduleService(supabase!, tripId);
    return res.status(200).json(schedule);
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Failed to fetch schedule", error: err.message });
  }
};

export const reorderItinerary = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const supabase = createUserClientFromAuthHeader(authHeader!);
  const parsed = reorderItinerarySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ 
      errors: parsed.error.flatten().fieldErrors 
    });
  }

  try {
    const result = await reorderItineraryService(
      supabase!,
      parsed.data.updates,
      parsed.data.tripId 
    );

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(403).json({ 
      message: "Reorder failed", 
      error: err.message 
    });
  }
};

export const createItineraryItem = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const supabase = createUserClientFromAuthHeader(authHeader);
  if (!supabase) {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }

  // Validate the body against your schema
  const parsed = createItinerarySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const item = await createItineraryItemService(supabase, parsed.data);
    return res.status(201).json(item);
  } catch (err: any) {
    return res.status(403).json({
      message: "Failed to create itinerary item",
      error: err.message,
    });
  }
};


export async function deleteItinerary(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest; 
  const itemId = Array.isArray(authReq.params.itemId)
    ? authReq.params.itemId[0]
    : authReq.params.itemId;

  const data = await deleteItineraryItemService(authReq.supabase, itemId);

  // Safeguard: Check if data is null or an empty array
  if (!data || data.length === 0) {
    return res.status(404).json({ 
      message: "Itinerary item does not exist or you do not have permission to delete it" 
    });
  }

  return res.status(200).json({ 
    message: "Deleted successfully", 
    data: data[0] // Return the single deleted object instead of an array
  });
}