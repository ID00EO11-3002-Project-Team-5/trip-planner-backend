import { SupabaseClient } from "@supabase/supabase-js";
import { CreateExpenseInput } from "../validators/expense.schema";

export const createExpenseService = async (
  supabase: SupabaseClient,
  payload: CreateExpenseInput,
  userId: string,
) => {
  //  Validate that shares sum equals total amount
  const totalShares = payload.shares.reduce(
    (sum, share) => sum + share.shareamount_exsh,
    0,
  );

  if (totalShares !== payload.amount_expe) {
    throw new Error("Sum of shares must equal total expense amount");
  }
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
   if (!expense) {
    throw new Error("Expense creation failed");
  }
  //  Insert expense shares
  const { error: sharesError } = await supabase
    .from("t_expense_share_exsh")
    .insert(
      payload.shares.map((share) => ({
        id_expe: expense.id_expe,
        id_user: share.id_user,
        shareamount_exsh: share.shareamount_exsh,
      })),
    );

  if (sharesError) {
    throw new Error(sharesError.message);
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
/**
 * Get all expenses for a trip (with shares and payers)
 */
export const getExpensesByTripService = async (
  supabase: SupabaseClient,
  tripId: string,
) => {
  const { data, error } = await supabase
    .from("t_expense_expe")
    .select(`
      id_expe,
      title_expe,
      amount_expe,
      currency_expe,
      createdat_expe,
      created_by,
      t_expense_share_exsh (
        id_user,
        shareamount_exsh
      ),
      t_expense_payer_expa (
        id_user,
        payeramount_expa
      )
    `)
    .eq("id_trip", tripId)
    .order("createdat_expe", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
