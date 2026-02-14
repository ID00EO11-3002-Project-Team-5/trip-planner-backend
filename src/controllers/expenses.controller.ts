import { Request, Response } from "express";
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

export const createExpense = async (req: Request, res: Response) => {
  if (!req.supabase || !req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing security context" });
  }

  try {
    const input = createExpenseSchema.parse(req.body);

    const expense = await createExpenseService(
      req.supabase,
      input,
      req.user.id,
    );

    return res.status(201).json(expense);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      message: "Failed to create expense",
      error: message,
    });
  }
};
/**
 * GET /expenses?tripId=<uuid>
 */
export const getExpensesByTrip = async (req: Request, res: Response) => {
  if (!req.supabase) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { tripId } = req.query;

  if (!tripId || typeof tripId !== "string") {
    return res.status(400).json({
      message: "tripId query parameter is required",
    });
  }

  try {
    const expenses = await getExpensesByTripService(req.supabase, tripId);
    return res.status(200).json(expenses);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      message: "Failed to fetch expenses",
      error: message,
    });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  if (!req.supabase) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { id: expenseId } = req.params;

    if (typeof expenseId !== "string") {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const input = updateExpenseSchema.parse(req.body);

    const updatedExpense = await updateExpenseService(
      req.supabase,
      expenseId,
      input,
    );

    return res.status(200).json(updatedExpense);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      message: "Failed to update expense",
      error: message,
    });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  if (!req.supabase) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { id: expenseId } = req.params;

    if (typeof expenseId !== "string") {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    await deleteExpenseService(req.supabase, expenseId);

    return res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      message: "Failed to delete expense",
      error: message,
    });
  }
};
