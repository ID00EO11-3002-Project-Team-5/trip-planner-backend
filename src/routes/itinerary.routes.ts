import { Router } from "express";
import {
  createItineraryItem,
  getTripSchedule,
  reorderItinerary,
  deleteItinerary,
  createFullItineraryItem,
} from "../controllers/itinerary.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();
router.post("/full", protect, createFullItineraryItem);
router.post("/", protect, createItineraryItem);
router.get("/trip/:tripId", protect, getTripSchedule);
router.patch("/reorder", protect, reorderItinerary);
router.delete("/:itemId", protect, deleteItinerary);

export default router;
