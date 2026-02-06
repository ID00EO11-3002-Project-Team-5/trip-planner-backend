import { Router } from "express";
import { calculateSettlements } from "../services/settlement.service";

const router = Router();

/**
 * POST /settlements
 * Calculates who owes whom based on balances
 */
router.post("/", (req, res) => {
  const balances = req.body;

  if (!Array.isArray(balances)) {
    return res.status(400).json({
      message: "Balances must be an array",
    });
  }

  const settlements = calculateSettlements(balances);

  res.status(200).json({
    message: "Settlements calculated",
    data: settlements,
  });
});

export default router;
