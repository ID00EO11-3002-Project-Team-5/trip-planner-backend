import { Request, Response } from "express";
import { createExpenseSchema } from "../validators/expense.schema";
import { createUserClientFromAuthHeader } from "../lib/supabaseClients";
import { createExpenseService } from "../services/expenses.service";

export const createExpense = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const supabase = createUserClientFromAuthHeader(authHeader);
  if (!supabase) {
    return res.status(401).json({ message: "Invalid Authorization header" });
  }

  const parsed = createExpenseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const expense = await createExpenseService(supabase, parsed.data);
    return res.status(201).json(expense);
  } catch (err: any) {
    return res.status(403).json({
      message: "Failed to create expense",
      error: err.message,
    });
  }
};
