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
import lodgingRoutes from "./routes/lodging.routes";
import transportRoutes from "./routes/transport.routes";
import messageRoutes from "./routes/message.routes";

const app = express();

// CORS configuration - support multiple frontend origins
const allowedOrigins = [
  "https://www.eztrippin.me",
  "https://trip-planner-frontend-livid.vercel.app",
  "http://localhost:3001",
  process.env.FRONTEND_URL, // Additional custom URL from env
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
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

// Swagger API Documentation - Custom HTML with CDN for serverless
app.get("/api-docs", (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trip Planner API Docs</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    .swagger-ui .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const spec = ${JSON.stringify(swaggerSpec)};
      window.ui = SwaggerUIBundle({
        spec: spec,
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

//  Wire expenses routes
app.use("/expenses", expensesRoutes);
app.use("/settlements", settlementsRoutes);
app.use("/trips", tripsRoutes);
app.use("/auth", authserviceRoutes);
app.use("/stops", destination_stopRoutes);
app.use("/itinerary", itineraryRoutes);
app.use("/lodging", lodgingRoutes);
app.use("/transport", transportRoutes);
app.use("/messages", messageRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
