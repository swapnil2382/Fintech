const express = require("express");
const Expense = require("../models/Expense");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, category, description } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newExpense = new Expense({ userId: req.user.userId, amount, category, description });
    await newExpense.save();

    user.remainingBudget -= amount;
    await user.save();

    res.json({ message: "Expense added", expense: newExpense, remainingBudget: user.remainingBudget });
  } catch (error) {
    res.status(500).json({ error: "Error adding expense" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: "Expense not found" });

    const user = await User.findById(req.user.userId);
    user.remainingBudget += expense.amount;
    await user.save();

    await expense.deleteOne();
    res.json({ message: "Expense deleted", remainingBudget: user.remainingBudget });
  } catch (error) {
    res.status(500).json({ error: "Error deleting expense" });
  }
});

module.exports = router;
