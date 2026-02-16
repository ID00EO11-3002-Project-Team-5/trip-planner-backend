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

/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title_trip
 *               - startdate_trip
 *               - enddate_trip
 *             properties:
 *               title_trip:
 *                 type: string
 *                 description: Trip title
 *               description_trip:
 *                 type: string
 *                 description: Trip description (optional)
 *               startdate_trip:
 *                 type: string
 *                 format: date-time
 *                 description: Trip start date (ISO string)
 *               enddate_trip:
 *                 type: string
 *                 format: date-time
 *                 description: Trip end date (ISO string)
 *     responses:
 *       201:
 *         description: Trip created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createTrip);

/**
 * @swagger
 * /trips:
 *   get:
 *     summary: Get all trips for the authenticated user
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getTrips);

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Get a specific trip by ID
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip details
 *       404:
 *         description: Trip not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getTrip);

/**
 * @swagger
 * /trips/{id}:
 *   put:
 *     summary: Update a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title_trip:
 *                 type: string
 *                 description: Trip title
 *               description_trip:
 *                 type: string
 *                 description: Trip description
 *               startdate_trip:
 *                 type: string
 *                 format: date-time
 *                 description: Trip start date (ISO string)
 *               enddate_trip:
 *                 type: string
 *                 format: date-time
 *                 description: Trip end date (ISO string)
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       403:
 *         description: Forbidden - not authorized to update this trip
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updateTrip);

/**
 * @swagger
 * /trips/{id}:
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteTrip);

export default router;
