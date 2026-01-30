import Decimal from "decimal.js";

export function calculateBalances(
  expenses: { paidBy: string; amount: number; participants: string[] }[]
) {
  const balances: Record<string, Decimal> = {};

  expenses.forEach(exp => {
    const share = new Decimal(exp.amount).div(exp.participants.length);

    exp.participants.forEach(user => {
      balances[user] = (balances[user] || new Decimal(0)).minus(share);
    });

    balances[exp.paidBy] = (balances[exp.paidBy] || new Decimal(0))
      .plus(new Decimal(exp.amount));
  });

  return Object.fromEntries(
    Object.entries(balances).map(([k, v]) => [k, v.toNumber()])
  );
}
