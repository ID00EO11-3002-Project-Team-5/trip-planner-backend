import { Router } from "express";
import { transportController } from "../controllers/transport.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, transportController.create);
router.get("/itinerary/:id_itit", protect, transportController.getByItinerary);
router.get("/:id_tran", protect, transportController.getById);
router.patch("/:id_tran", protect, transportController.update);
router.delete("/:id_tran", protect, transportController.delete);

export default router;
