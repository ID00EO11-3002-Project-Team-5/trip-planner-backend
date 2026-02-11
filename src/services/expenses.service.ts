import { SupabaseClient } from "@supabase/supabase-js";
import {
  CreateExpenseInput,
  UpdateExpenseInput,
} from "../validators/expense.schema";

const FLOAT_TOLERANCE = 0.01;
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

  if (Math.abs(totalShares - payload.amount_expe) > FLOAT_TOLERANCE) {
    throw new Error("Sum of shares must equal total expense amount");
  }
  // create expenses
  const { data: expense, error: expenseError } = await supabase
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

  if (expenseError || !expense) {
    throw new Error(expenseError?.message || "Expense creation failed");
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
    throw new Error(`Failed to insert payer: ${payerError.message}`);
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
    .select(
      `
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
    `,
    )
    .eq("id_trip", tripId)
    .order("createdat_expe", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
/**
 * UPDATE expense (creator only – enforced by RLS)
 */
export const updateExpenseService = async (
  supabase: SupabaseClient,
  expenseId: string,
  payload: UpdateExpenseInput,
) => {
  // 1️⃣ Update expense row
  const { data: expense, error: expenseError } = await supabase
    .from("t_expense_expe")
    .update({
      title_expe: payload.title_expe,
      amount_expe: payload.amount_expe,
      currency_expe: payload.currency_expe,
    })
    .eq("id_expe", expenseId)
    .select()
    .single();

  if (expenseError || !expense) {
    throw new Error("Failed to update expense");
  }

  // 2️⃣ Replace shares if provided
  if (payload.shares) {
    const totalShares = payload.shares.reduce(
      (sum, share) => sum + share.shareamount_exsh,
      0,
    );

    if (
      payload.amount_expe !== undefined &&
      Math.abs(totalShares - payload.amount_expe) > FLOAT_TOLERANCE
    ) {
      throw new Error("Sum of shares must equal total expense amount");
    }

    // Delete old shares
    await supabase
      .from("t_expense_share_exsh")
      .delete()
      .eq("id_expe", expenseId);

    // Insert new shares
    const { error: shareError } = await supabase
      .from("t_expense_share_exsh")
      .insert(
        payload.shares.map((share) => ({
          id_expe: expenseId,
          id_user: share.id_user,
          shareamount_exsh: share.shareamount_exsh,
        })),
      );

    if (shareError) {
      throw new Error(`Failed to update shares: ${shareError.message}`);
    }
  }

  return expense;
};

/**
 * DELETE expense (creator only – enforced by RLS)
 */
export const deleteExpenseService = async (
  supabase: SupabaseClient,
  expenseId: string,
) => {
  const { error } = await supabase
    .from("t_expense_expe")
    .delete()
    .eq("id_expe", expenseId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
};
