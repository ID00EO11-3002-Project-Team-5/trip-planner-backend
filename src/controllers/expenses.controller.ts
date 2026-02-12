import { Response } from "express";
import {
  createExpenseSchema,
  updateExpenseSchema,
} from "../validators/expense.schema";
import {
  createExpenseService,
  getExpensesByTripService,
  updateExpenseService,
  deleteExpenseService,
} from "../services/expenses.service";
import { AuthRequest } from "../middleware/authMiddleware";

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    // Validate request body
    const input = createExpenseSchema.parse(req.body);

    // Use values injected by protect middleware
    const expense = await createExpenseService(
      req.supabase!, // user-scoped Supabase client
      input,
      req.user!.id, // authenticated user id
    );

    return res.status(201).json(expense);
  } catch (err) {
    return res.status(400).json({
      message: "Failed to create expense",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
/**
 * GET /expenses?tripId=<uuid>
 */
export const getExpensesByTrip = async (req: AuthRequest, res: Response) => {
  const tripId = req.query.tripId as string;

  if (!tripId) {
    return res.status(400).json({
      message: "tripId query parameter is required",
    });
  }

  try {
    const expenses = await getExpensesByTripService(
      req.supabase!, // user-scoped Supabase client
      tripId,
    );

    return res.status(200).json(expenses);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch expenses",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
/**
 * PUT /expenses/:id
 * Update an expense (creator only – enforced by RLS)
 */
export const updateExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expenseId = req.params.id as string;
    const input = updateExpenseSchema.parse(req.body);

    const updatedExpense = await updateExpenseService(
      req.supabase!,
      expenseId,
      input,
    );

    return res.status(200).json(updatedExpense);
  } catch (err) {
    return res.status(400).json({
      message: "Failed to update expense",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

/**
 * DELETE /expenses/:id
 * Delete an expense (creator only – enforced by RLS)
 */
export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expenseId = req.params.id as string;

    await deleteExpenseService(req.supabase!, expenseId);

    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({
      message: "Failed to delete expense",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
