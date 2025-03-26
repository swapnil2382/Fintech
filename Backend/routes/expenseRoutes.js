const express = require("express");
const { Expense } = require("../models/Expense");
const Budget = require("../models/Budget");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Add Expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Incoming expense data:", req.body);

    let { amount, category, description } = req.body;
    amount = parseFloat(amount);

    if (!amount || isNaN(amount)) {
      console.error("Invalid amount received:", amount);
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (!category || category === "Uncategorized") {
      console.error("Invalid category received:", category);
      return res.status(400).json({ error: "Invalid category" });
    }

    if (!description || description.trim() === "") {
      console.error("Description is missing or empty");
      return res.status(400).json({ error: "Description is required" });
    }

    const month = new Date().toLocaleString("default", { month: "long", year: "numeric" });
    let budget = await Budget.findOne({ user: req.user.id, month });

    if (!budget) {
      console.log("⚠️ No budget found for this month, returning error.");
      return res.status(400).json({ error: "No budget set for this month" });
    }

    budget.remainingBudget = Number(budget.remainingBudget);

    if (isNaN(budget.remainingBudget)) {
      console.error("❌ remainingBudget is NaN before subtraction! Fixing it.");
      budget.remainingBudget = budget.limit || 0;
    }

    if (budget.remainingBudget < amount) {
      return res.status(400).json({ error: "Not enough remaining budget" });
    }

    budget.remainingBudget -= amount;
    await budget.save();

    const expense = new Expense({ user: req.user.id, amount, category, description });
    await expense.save();

    res.status(201).json({ expense, remainingBudget: budget.remainingBudget });
  } catch (error) {
    console.error("🔥 Error adding expense:", error);
    res.status(500).json({ error: "Error adding expense", details: error.message });
  }
});

// Fetch All Expenses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error("🔥 Error fetching expenses:", error);
    res.status(500).json({ error: "Error fetching expenses", details: error.message });
  }
});

// Fetch Financial Summary
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });

    if (!expenses || expenses.length === 0) {
      return res.json({ totalSpent: 0, categoryBreakdown: {}, monthlySpending: {}, budgetAdvice: "No expenses recorded yet." });
    }

    let totalSpent = 0;
    let categoryBreakdown = {};
    let monthlySpending = {};

    expenses.forEach((expense) => {
      totalSpent += expense.amount;
      categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + expense.amount;
      const month = new Date(expense.date).toLocaleString("default", { month: "short", year: "numeric" });
      monthlySpending[month] = (monthlySpending[month] || 0) + expense.amount;
    });

    let highestCategory = Object.keys(categoryBreakdown).reduce((a, b) =>
      categoryBreakdown[a] > categoryBreakdown[b] ? a : b, ""
    );

    let budgetAdvice = highestCategory
      ? `You spent the most on ${highestCategory}. Consider reducing expenses in this category.`
      : "Keep tracking your expenses for better insights.";

    res.json({ totalSpent, categoryBreakdown, monthlySpending, budgetAdvice });
  } catch (error) {
    res.status(500).json({ error: "Error fetching financial summary" });
  }
});

// Reset Expenses
router.delete("/reset", authMiddleware, async (req, res) => {
  try {
    await Expense.deleteMany({ user: req.user.id });
    res.json({ message: "All expenses cleared successfully!" });
  } catch (error) {
    console.error("Error clearing expenses:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch Remaining Budget
router.get("/remaining-budget", authMiddleware, async (req, res) => {
  try {
    const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
    let budget = await Budget.findOne({ user: req.user.id, month: currentMonth });

    if (!budget) {
      return res.status(400).json({ error: "No budget set for this month" });
    }

    res.json({ remainingBudget: budget.remainingBudget });
  } catch (error) {
    console.error("🔥 Error fetching remaining budget:", error);
    res.status(500).json({ error: "Error fetching remaining budget" });
  }
});

// Set or Update Remaining Budget
router.post("/remaining-budget", authMiddleware, async (req, res) => {
  try {
    const { limit } = req.body;
    const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });

    let budget = await Budget.findOne({ user: req.user.id, month: currentMonth });

    if (budget) {
      if (budget.month !== currentMonth) {
        budget.remainingBudget = limit;
        budget.limit = limit;
      }
    } else {
      budget = new Budget({
        user: req.user.id,
        limit,
        remainingBudget: limit,
        month: currentMonth,
      });
    }

    await budget.save();
    res.json({ success: true, remainingBudget: budget.remainingBudget });
  } catch (error) {
    console.error("🔥 Error saving remaining budget:", error);
    res.status(500).json({ error: "Error saving remaining budget" });
  }
});

module.exports = router;