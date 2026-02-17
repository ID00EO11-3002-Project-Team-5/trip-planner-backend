import { Router } from "express";
import {
  createStop,
  reorderStops,
  getStopsByTrip,
  deleteStop,
} from "../controllers/destination_stops.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

/**
 * GET /stops/trip/:tripId
 * Returns an array of location objects for a specific trip.
 * Useful for mapping out the trip's destination places.
 */
router.get("/trip/:tripId", protect, getStopsByTrip);

/**
 * POST /stops/
 * Add a new destination place to a trip.
 */
router.post("/", protect, createStop);

/**
 * PATCH /stops/reorder
 * Update the visual order of the destination list.
 */
router.patch("/reorder", protect, reorderStops);
/**
 * DELETE /stops/:stopId
 * Remove a specific destination stop from a trip.
 */
router.delete("/:stopId", protect, deleteStop);

export default router;
