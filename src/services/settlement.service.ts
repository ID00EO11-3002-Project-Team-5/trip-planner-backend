import Decimal from "decimal.js";

export interface Balance {
  userId: string;
  amount: number; // positive = should receive, negative = should pay
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}
const ZERO = new Decimal(0);
const TOLERANCE = new Decimal(0.01);

/**
 * Calculate settlements based on user balances
 */
export function calculateSettlements(balances: Balance[]): Settlement[] {
  const debtors = balances
    .filter((b) => b.amount < 0)
    .map((b) => ({
      userId: b.userId,
      amount: new Decimal(-b.amount),
    }))
    .sort((a, b) => a.amount.comparedTo(b.amount)); // smaller debts first

  const creditors = balances
    .filter((b) => b.amount > 0)
    .map((b) => ({
      userId: b.userId,
      amount: new Decimal(b.amount),
    }))
    .sort((a, b) => b.amount.comparedTo(a.amount)); // larger credits first

  const settlements: Settlement[] = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const payment = Decimal.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: payment.toNumber(),
    });

    debtor.amount = debtor.amount.minus(payment);
    creditor.amount = creditor.amount.minus(payment);

    if (debtor.amount.abs().lessThan(TOLERANCE)) {
      debtor.amount = ZERO;
      i++;
    }

    if (creditor.amount.abs().lessThan(TOLERANCE)) {
      creditor.amount = ZERO;
      j++;
    }
  }

  return settlements;
}
