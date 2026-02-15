import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { supabase } from "./lib/supabaseClients";
import { swaggerSpec } from "./lib/swagger";
import expensesRoutes from "./routes/expenses.routes";
import settlementsRoutes from "./routes/settlements.routes";
import "dotenv/config";
import authserviceRoutes from "./routes/auth.routes";
import tripsRoutes from "./routes/trips.routes";
import itineraryRoutes from "./routes/itinerary.routes";
import destination_stopRoutes from "./routes/destination_stops.routes";

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use((req: any, res, next) => {
  req.supabase = supabase;
  next();
});

// Redirect root to API docs
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Backend is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Backend is running
 */
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Trip Planner API Docs",
  customCss: '.swagger-ui .topbar { display: none }',
}));

//  Wire expenses routes
app.use("/expenses", expensesRoutes);
app.use("/settlements", settlementsRoutes);
app.use("/trips", tripsRoutes);
app.use("/auth", authserviceRoutes);
app.use("/stops", destination_stopRoutes);
app.use("/itinerary", itineraryRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
