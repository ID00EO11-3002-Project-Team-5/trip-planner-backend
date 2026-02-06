import { Request, Response } from "express";
import { createTripSchema } from "../validators/trip.schema";
import { createUserClientFromAuthHeader } from "../lib/supabaseClients";
import { createTripService } from "../services/trips.service";

export const createTrip = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const supabase = createUserClientFromAuthHeader(authHeader);
  if (!supabase) {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }

  const parsed = createTripSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const trip = await createTripService(supabase, parsed.data);
    return res.status(201).json(trip);
  } catch (err: any) {
    return res.status(403).json({
      message: "Failed to create trip",
      error: err.message,
    });
  }
};
