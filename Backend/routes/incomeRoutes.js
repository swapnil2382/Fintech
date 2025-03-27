const express = require("express");
const Income = require("../models/Income");

const LockStatus = require("../models/LockStatus");  // NEW Model for user lock status
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Add Income (User-Specific)
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Check if income is locked for this user
    const lockStatus = await LockStatus.findOne({ user: req.user.id });
    if (lockStatus && lockStatus.isLocked) {
      return res.status(400).json({ error: "Income is locked for this month" });
    }

    const { amount, source, description } = req.body;
    const income = new Income({ user: req.user.id, amount, source, description });
    await income.save();

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ error: "Error adding income" });
  }
});

// ✅ Get User's Income (Filtered by User)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const income = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ error: "Error fetching income" });
  }
});

// ✅ Reset all user's income history
router.post("/reset", authMiddleware, async (req, res) => {
  try {
    await Income.deleteMany({ user: req.user.id }); // Delete all income records for the user
    res.json({ message: "Income history reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting income history" });
  }
});

router.get("/total", authMiddleware, async (req, res) => {
  try {
    const incomeList = await Income.find({ user: req.user.id });
    const totalIncome = incomeList.reduce((sum, inc) => sum + inc.amount, 0);
    res.json({ totalIncome });
  } catch (error) {
    res.status(500).json({ error: "Error fetching total income" });
  }
});


module.exports = router;
