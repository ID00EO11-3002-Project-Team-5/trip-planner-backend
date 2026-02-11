import { z } from "zod";

export const expenseShareSchema = z.object({
  id_user: z.string().uuid(),
  shareamount_exsh: z.number().positive().finite(),
});

export const createExpenseSchema = z.object({
  id_trip: z.string().uuid(),
  title_expe: z.string().min(1),
  amount_expe: z.number().positive(),
  currency_expe: z.enum(["USD", "EUR", "GBP"]),

  shares: z.array(expenseShareSchema).min(1),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

export const updateExpenseSchema = createExpenseSchema.partial();
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
