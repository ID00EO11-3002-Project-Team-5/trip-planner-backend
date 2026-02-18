import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  sendMessage,
  getMessagesByTrip,
} from "../controllers/message.controller";

const router = Router();

/**
 * Send message to trip
 */
router.post("/trips/:tripId", protect, sendMessage);

/**
 * Get messages for a trip
 */
router.get("/trips/:tripId", protect, getMessagesByTrip);

export default router;
