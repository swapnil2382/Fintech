const express = require("express");
const Income = require("../models/Income");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Add Income
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, source } = req.body;
    const income = new Income({ user: req.user.id, amount, source });
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ error: "Error adding income" });
  }
});

// ✅ Get User Income
router.get("/", authMiddleware, async (req, res) => {
  try {
    const income = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ error: "Error fetching income" });
  }
});

// ✅ Delete Income
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting income" });
  }
});

module.exports = router;
