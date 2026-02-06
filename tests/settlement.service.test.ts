import { calculateSettlements } from "../src/services/settlement.service";

describe("Settlement Service", () => {
  it("should calculate correct settlements", () => {
    const balances = [
      { userId: "Alice", amount: 120 },
      { userId: "Bob", amount: -40 },
      { userId: "Chris", amount: -40 },
      { userId: "Dana", amount: -40 },
    ];

    const result = calculateSettlements(balances);

    expect(result).toEqual([
      { from: "Bob", to: "Alice", amount: 40 },
      { from: "Chris", to: "Alice", amount: 40 },
      { from: "Dana", to: "Alice", amount: 40 },
    ]);
  });
});
