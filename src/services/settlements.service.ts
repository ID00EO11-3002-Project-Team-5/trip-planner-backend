import { SupabaseClient } from "@supabase/supabase-js";
import { calculateSettlements, Balance } from "./settlement.service";

export const calculateSettlementsService = async (
  supabase: SupabaseClient,
  tripId: string,
) => {
  //  Fetch expense payers & shares
  const { data, error } = await supabase
    .from("t_expense_expe")
    .select(
      `
      t_expense_payer_expa (
        id_user,
        payeramount_expa
      ),
      t_expense_share_exsh (
        id_user,
        shareamount_exsh
      )
    `,
    )
    .eq("id_trip", tripId);

  if (error) {
    throw new Error(error.message);
  }

  //  Aggregate balances
  const balanceMap: Record<string, number> = {};

  for (const expense of data ?? []) {
    for (const payer of expense.t_expense_payer_expa ?? []) {
      balanceMap[payer.id_user] =
        (balanceMap[payer.id_user] || 0) + payer.payeramount_expa;
    }

    for (const share of expense.t_expense_share_exsh ?? []) {
      balanceMap[share.id_user] =
        (balanceMap[share.id_user] || 0) - share.shareamount_exsh;
    }
  }

  const balances: Balance[] = Object.entries(balanceMap).map(
    ([userId, amount]) => ({
      userId,
      amount,
    }),
  );

  //  Calculate settlements
  return calculateSettlements(balances);
};
