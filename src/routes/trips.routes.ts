import { Router } from "express";
import { createTrip,   deleteTrip, getTrip, getTrips, updateTrip} from "../controllers/trips.controller";

const router = Router();

router.post("/", createTrip);
router.get("/", getTrips);
router.get("/:id", getTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export default router;
