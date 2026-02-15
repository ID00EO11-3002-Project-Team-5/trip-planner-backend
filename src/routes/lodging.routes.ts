import { Router } from "express";
import { lodgingController } from "../controllers/lodging.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Applying protect to each specific route method
router.post("/", protect, lodgingController.create);
router.get("/itinerary/:id_itit", protect, lodgingController.getByItinerary);
router.get("/:id_lodg", protect, lodgingController.getById);
router.patch("/:id_lodg", protect, lodgingController.update);
router.delete("/:id_lodg", protect, lodgingController.delete);

export default router;
