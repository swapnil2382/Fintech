const express = require("express");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Get Tax Summary
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id });
    const expenses = await Expense.find({ user: req.user.id });

    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const deductibleExpenses = expenses
      .filter((exp) => ["Rent", "Transport"].includes(exp.category)) // Mock deductible categories
      .reduce((sum, exp) => sum + exp.amount, 0);
    const taxableIncome = Math.max(totalIncome - deductibleExpenses, 0);

    // Mock tax slabs (simplified for demo)
    let tax = 0;
    if (taxableIncome <= 50000)
      tax = taxableIncome * 0.1; // 10% for up to ₹50,000
    else tax = 5000 + (taxableIncome - 50000) * 0.2; // ₹5,000 + 20% above ₹50,000

    // Mock deduction insight
    const deductionInsight =
      deductibleExpenses > 0
        ? `Your ₹${deductibleExpenses} in deductible expenses (e.g., Rent, Transport) could reduce your tax by ₹${(
            deductibleExpenses * 0.1
          ).toFixed(2)}.`
        : "Add deductible expenses (e.g., Rent, Transport) to lower your tax.";

    res.json({
      totalIncome,
      deductibleExpenses,
      taxableIncome,
      estimatedTax: tax,
      deductionInsight,
    });
  } catch (error) {
    res.status(500).json({ error: "Error calculating tax summary" });
  }
});

module.exports = router;
