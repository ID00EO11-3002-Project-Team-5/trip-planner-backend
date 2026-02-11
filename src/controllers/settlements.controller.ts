import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { calculateSettlementsService } from "../services/settlements.service";

/**
 * GET /settlements?tripId=<uuid>
 * Calculate settlements for a trip
 */
export const getTripSettlements = async (req: AuthRequest, res: Response) => {
  const tripId = req.query.tripId as string;

  if (!tripId) {
    return res.status(400).json({
      message: "tripId query parameter is required",
    });
  }

  try {
    const result = await calculateSettlementsService(req.supabase!, tripId);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to calculate settlements",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
