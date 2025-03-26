const express = require("express");
const Budget = require("../models/Budget");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Add or Update Budget
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { category, limit, month } = req.body;
    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category,
      month,
    });
    if (existingBudget) {
      existingBudget.limit = limit;
      await existingBudget.save();
      return res.json(existingBudget);
    }
    const budget = new Budget({ user: req.user.id, category, limit, month });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ error: "Error saving budget" });
  }
});

// Get Budgets for a Month
router.get("/:month", authMiddleware, async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.user.id,
      month: req.params.month,
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching budgets" });
  }
});

module.exports = router;
