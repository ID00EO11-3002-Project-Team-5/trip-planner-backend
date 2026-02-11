import { Request, Response } from "express";
import { createTripSchema } from "../validators/trip.schema";
import { createUserClientFromAuthHeader } from "../lib/supabaseClients";
import { createTripService, getUserTripsService, getTripService , updateTripService, deleteTripService} from "../services/trips.service";

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


export const getTrips = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const supabase = createUserClientFromAuthHeader(authHeader);
  if (!supabase) {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }

  try {
    const trips = await getUserTripsService(supabase);
    return res.status(200).json(trips);
  } catch (err: any) {
    return res.status(500).json({
      message: "Failed to fetch trips",
      error: err.message,
    });
  }
};

export const getTrip = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const { id } = req.params as { id: string };

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const supabase = createUserClientFromAuthHeader(authHeader);
  if (!supabase) {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }

  try {
    const trip = await getTripService(supabase, id);
    return res.status(200).json(trip);
  } catch (err: any) {
    return res.status(404).json({
      message: "Trip not found",
      error: err.message,
    });
  }
};


export const updateTrip = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const { id } = req.params as { id: string };

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const supabase = createUserClientFromAuthHeader(authHeader);
  if (!supabase) {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }

  try {
    const trip = await updateTripService(supabase, id, req.body);
    return res.status(200).json(trip);
  } catch (err: any) {
    return res.status(403).json({
      message: "Failed to update trip",
      error: err.message,
    });
  }
};



export const deleteTrip = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const { id } = req.params as { id: string };

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const supabase = createUserClientFromAuthHeader(authHeader);
  if (!supabase) {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }

  try {
    await deleteTripService(supabase, id);
    return res.status(204).send();
  } catch (err: any) {
    return res.status(403).json({
      message: "Failed to delete trip",
      error: err.message,
    });
  }
};