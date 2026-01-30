import express from "express";
import cors from "cors";
import expensesRoutes from "./routes/expenses.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});
//  Wire expenses routes
app.use("/expenses", expensesRoutes);

export default app;
