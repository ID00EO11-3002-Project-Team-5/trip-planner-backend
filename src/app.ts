import express from "express";
import cors from "cors";
import expensesRoutes from "./routes/expenses.routes";
import settlementsRoutes from "./routes/settlements.routes";
import 'dotenv/config'
import tripsRoutes from "./routes/trips.routes";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});


//  Wire expenses routes
app.use("/expenses", expensesRoutes);
app.use("/settlements", settlementsRoutes);
app.use("/trips", tripsRoutes);


export default app;
