import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createExpense,
  getExpensesByTrip,
  updateExpense,
  deleteExpense,
} from "../controllers/expenses.controller";

const router = Router();

/**
 * POST /expenses
 * Create a new expense for a trip.
 *
 * Requires:
 * - Authorization: Bearer <JWT>
 *
 * Notes:
 * - Uses user-scoped Supabase client
 * - Authorization enforced via RLS (auth.uid())
 */
router.post("/", protect, createExpense);
  
/**
 * GET /expenses?tripId=<uuid>
 * Get all expenses for a trip.
 */
router.get("/", protect, getExpensesByTrip);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);
export default router;
