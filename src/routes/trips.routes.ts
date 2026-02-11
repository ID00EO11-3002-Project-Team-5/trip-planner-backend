import { Router } from "express";
import {
  createTrip,
  deleteTrip,
  getTrip,
  getTrips,
  updateTrip,
} from "../controllers/trips.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createTrip);
router.get("/", protect, getTrips);
router.get("/:id", protect, getTrip);
router.put("/:id", protect, updateTrip);
router.delete("/:id", protect, deleteTrip);

export default router;
