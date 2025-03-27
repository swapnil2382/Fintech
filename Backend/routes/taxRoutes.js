const express = require("express");

const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id });
    const expenses = await Expense.find({ user: req.user.id });

    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const deductibleExpenses = expenses
      .filter((exp) => ["Rent", "Transport"].includes(exp.category))
      .reduce((sum, exp) => sum + exp.amount, 0);
    const taxableIncome = Math.max(totalIncome - deductibleExpenses, 0);

    let tax = 0;
    if (taxableIncome <= 50000) tax = taxableIncome * 0.1;
    else tax = 5000 + (taxableIncome - 50000) * 0.2;

    const deductionInsight =
      deductibleExpenses > 0
        ? `Your ₹${deductibleExpenses} in deductible expenses (e.g., Rent, Transport) could reduce your tax by ₹${(
            deductibleExpenses * 0.1
          ).toFixed(2)}.`
        : "Add deductible expenses (e.g., Rent, Transport) to lower your tax.";

    // Mock form data
    const formData = {
      name: "User Name", // Replace with actual user data if available
      income: totalIncome,
      deductions: deductibleExpenses,
      taxableIncome,
      taxDue: tax,
      filingDate: new Date().toLocaleDateString(),
    };

    res.json({
      totalIncome,
      deductibleExpenses,
      taxableIncome,
      estimatedTax: tax,
      deductionInsight,
      formData,
    });
  } catch (error) {
    res.status(500).json({ error: "Error calculating tax summary" });
  }
});

module.exports = router;
