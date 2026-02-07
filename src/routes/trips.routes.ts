import { Router } from "express";
import { createTrip } from "../controllers/trips.controller";

const router = Router();

router.post("/", createTrip);

export default router;
