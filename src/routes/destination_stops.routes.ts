// src/routes/destination_stops.routes.ts
import { Router } from "express";
import {
  createStop,
  reorderStops,
} from "../controllers/destination_stops.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Add a new destination to a trip
router.post("/", protect, createStop);

// Update the visual order of the destination list
router.patch("/reorder", protect, reorderStops);

export default router;
