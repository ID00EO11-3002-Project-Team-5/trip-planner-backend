import { Router } from "express";
import { createExpenseSchema } from "../validators/expense.schema";

const router = Router();

/**
 * POST /expenses
 * Mock endpoint with validation
 */
router.post("/", (req, res) => {
  const result = createExpenseSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  res.status(201).json({
    message: "Expense received (mock)",
    data: result.data,
  });
});

export default router;
