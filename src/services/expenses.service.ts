import { SupabaseClient } from "@supabase/supabase-js";
import { CreateExpenseInput } from "../validators/expense.schema";

export const createExpenseService = async (
  supabase: SupabaseClient,
  payload: CreateExpenseInput,
  userId: string,
) => {
  // create expenses
  const {data: expense, error: expenseError } = await supabase
    .from("t_expense_expe")
    .insert({
      id_trip: payload.id_trip,
      title_expe: payload.title_expe,
      amount_expe: payload.amount_expe,
      currency_expe: payload.currency_expe,
      created_by: userId,
    })
    .select()
    .single();

  if (expenseError) {
    throw new Error(expenseError.message);
  }
  //  Create payer record (MVP: creator paid full amount)
  const { error: payerError } = await supabase
    .from("t_expense_payer_expa")
    .insert({
      id_expe: expense.id_expe,
      id_user: userId,
      payeramount_expa: payload.amount_expe,
    });

  if (payerError) {
    throw new Error(payerError.message);
  }

  return expense;
};
