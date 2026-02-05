import { SupabaseClient } from "@supabase/supabase-js";
import { CreateExpenseInput } from "../validators/expense.schema";

export const createExpenseService = async (
  supabase: SupabaseClient,
  payload: CreateExpenseInput
) => {
  const { data, error } = await supabase
    .from("t_expense_expe")
    .insert({
      id_trip: payload.id_trip,
      title_expe: payload.title_expe,
      amount_expe: payload.amount_expe,
      currency_expe: payload.currency_expe,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
