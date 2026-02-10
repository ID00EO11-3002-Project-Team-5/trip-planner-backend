import { z } from "zod";

export const createExpenseSchema = z.object({
  id_trip: z.string().uuid(),
  title_expe: z.string().min(1),
  amount_expe: z.number().positive(),
  currency_expe: z.enum(["USD", "EUR", "GBP"]),
});


export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

