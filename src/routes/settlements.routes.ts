import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { getTripSettlements } from "../controllers/settlements.controller";

const router = Router();

/**
 * GET /settlements?tripId=<uuid>
 */
router.get("/", protect, getTripSettlements);

export default router;
