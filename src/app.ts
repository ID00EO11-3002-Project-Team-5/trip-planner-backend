import express from "express";
import cors from "cors";
import expensesRoutes from "./routes/expenses.routes";
import settlementsRoutes from "./routes/settlements.routes";
import authserviceRoutes from "./routes/auth.routes"
import 'dotenv/config'
import { supabase } from "./config/supabaseClient";
import { authService } from "./services/authservice.service";



const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});
// 🔹 TEMPORARY Supabase test route
app.get("/supabase-test", async (req, res) => {
  const { data, error } = await supabase
    .from("t_trip_trip")
    .select("*")
    .limit(1);

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

//  Wire expenses routes
app.use("/expenses", expensesRoutes);
app.use("/settlements", settlementsRoutes);
app.use("/auth",authserviceRoutes)



export default app;
