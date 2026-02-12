import express from "express";
import cors from "cors";
import { supabase } from "./lib/supabaseClients";
import expensesRoutes from "./routes/expenses.routes";
import settlementsRoutes from "./routes/settlements.routes";
import "dotenv/config";
import authserviceRoutes from "./routes/auth.routes";
import tripsRoutes from "./routes/trips.routes";
import itineraryRoutes from "./routes/itinerary.routes"
import destination_stopRoutes from "./routes/destination_stops.routes"

const app = express();

app.use(cors());
app.use(express.json());

app.use((req: any , res, next) => {
  req.supabase = supabase; 
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

//  Wire expenses routes
app.use("/expenses", expensesRoutes);
app.use("/settlements", settlementsRoutes);
app.use("/trips", tripsRoutes);
app.use("/auth", authserviceRoutes);
app.use("/stops",destination_stopRoutes)
app.use("/itinerary",itineraryRoutes)
export default app;
