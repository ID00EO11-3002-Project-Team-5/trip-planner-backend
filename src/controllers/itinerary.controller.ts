import { Request, Response } from "express";
import {
  createItinerarySchema,
  reorderItinerarySchema,
} from "../validators/itinerary.schema";
import { lodgingService } from "../services/lodging.service";
import { transportService } from "../services/transport.service";
import {
  createItineraryItemService,
  getTripScheduleService,
  reorderItineraryService,
  deleteItineraryItemService,
} from "../services/itinerary.service";

export const getTripSchedule = async (req: Request, res: Response) => {
  const tripId = req.params.tripId as string;
  if (!req.supabase) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing security context" });
  }

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

export const reorderItinerary = async (req: Request, res: Response) => {
  const parsed = reorderItinerarySchema.safeParse(req.body);

  if (!req.supabase) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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

export const createItineraryItem = async (req: Request, res: Response) => {
  const parsed = createItinerarySchema.safeParse(req.body);

  if (!req.supabase) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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

export async function deleteItinerary(req: Request, res: Response) {
  const { itemId } = req.params as { itemId: string };

  if (!req.supabase) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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
export const createFullItineraryItem = async (req: Request, res: Response) => {
  const { id_trip, title_itit, date_itit, lodging, transport } = req.body;

  // 1. Insert ONLY the itinerary fields
  const { data: itinerary, error: ititError } = await req
    .supabase!.from("t_itinerary_item_itit")
    .insert({
      id_trip,
      title_itit,
      date_itit,
      // DO NOT put 'lodging' or 'transport' here!
    })
    .select()
    .single();

  if (ititError) throw ititError;

  // 2. Now use itinerary.id_itit to insert into the other tables
  if (lodging) {
    await req
      .supabase!.from("t_lodging_lodg")
      .insert({ ...lodging, id_itit: itinerary.id_itit });
  }

  if (transport) {
    await req
      .supabase!.from("t_transport_tran")
      .insert({ ...transport, id_itit: itinerary.id_itit });
  }

  // Return the combined object to the test
  res.status(201).json({ ...itinerary, lodging, transport });
};
