const express = require("express");
const Expense = require("../models/Expense");
const { authMiddleware } = require("../middleware/authMiddleware");
const { categorizeExpense } = require("../utils/categorization");

const router = express.Router();

// ✅ Add Expense with Auto Categorization
router.post("/", authMiddleware, async (req, res) => {
  try {
    let { amount, category, description } = req.body;

    if (!category || category === "Uncategorized") {
      category = categorizeExpense(description);
    }

    const expense = new Expense({ user: req.user.id, amount, category, description });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: "Error adding expense" });
  }
});

// ✅ Get Expenses (with Category)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

router.get("/summary", authMiddleware, async (req, res) => {
    try {
      const expenses = await Expense.find({ user: req.user.id });
  
      let totalSpent = 0;
      let categoryBreakdown = {};
      let monthlySpending = {};
  
      expenses.forEach((expense) => {
        totalSpent += expense.amount;
  
        // Category-wise Breakdown
        if (!categoryBreakdown[expense.category]) {
          categoryBreakdown[expense.category] = 0;
        }
        categoryBreakdown[expense.category] += expense.amount;
  
        // Monthly Spending Trend
        const month = new Date(expense.date).toLocaleString("default", { month: "short", year: "numeric" });
        if (!monthlySpending[month]) {
          monthlySpending[month] = 0;
        }
        monthlySpending[month] += expense.amount;
      });
  
      // Smart Budget Suggestion
      let highestCategory = Object.keys(categoryBreakdown).reduce((a, b) =>
        categoryBreakdown[a] > categoryBreakdown[b] ? a : b
      , "");
  
      let budgetAdvice = highestCategory
        ? `You spent the most on ${highestCategory}. Consider reducing expenses in this category.`
        : "Keep tracking your expenses for better insights.";
  
      res.json({ totalSpent, categoryBreakdown, monthlySpending, budgetAdvice });
    } catch (error) {
      res.status(500).json({ error: "Error fetching financial summary" });
    }
  });

module.exports = router;
