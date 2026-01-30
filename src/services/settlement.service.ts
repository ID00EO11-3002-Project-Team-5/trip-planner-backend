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

/**
 * Calculate settlements based on user balances
 */
export function calculateSettlements(balances: Balance[]): Settlement[] {
  const debtors = balances
    .filter(b => b.amount < 0)
    .map(b => ({ userId: b.userId, amount: new Decimal(-b.amount) }));

  const creditors = balances
    .filter(b => b.amount > 0)
    .map(b => ({ userId: b.userId, amount: new Decimal(b.amount) }));

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
      amount: payment.toNumber()
    });

    debtor.amount = debtor.amount.minus(payment);
    creditor.amount = creditor.amount.minus(payment);

    if (debtor.amount.equals(0)) i++;
    if (creditor.amount.equals(0)) j++;
  }

  return settlements;
}
