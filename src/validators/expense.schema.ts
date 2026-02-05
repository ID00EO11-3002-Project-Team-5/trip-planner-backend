import { z } from "zod";

export const createExpenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  paidBy: z.string().min(1, "PaidBy is required"),
  participants: z
    .array(z.string().min(1))
    .min(1, "At least one participant is required"),
});
