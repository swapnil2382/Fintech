const express = require("express");
const BankAccount = require("../models/BankAccount");
const Transaction = require("../models/Transaction");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all bank accounts for the user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const accounts = await BankAccount.find({ user: req.user.id });
    res.json(accounts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching accounts", details: error.message });
  }
});

// Add a new bank account
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, type, balance, income } = req.body;
    const newAccount = new BankAccount({
      user: req.user.id,
      name,
      type,
      balance: parseFloat(balance),
      income: parseFloat(income) || 0,
      lastSynced: new Date().toISOString(),
      status: "Connected",
    });
    await newAccount.save();
    res.json(newAccount);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error adding account", details: error.message });
  }
});

// Deduct amount from a specific bank account and record transactions
router.post("/deduct", authMiddleware, async (req, res) => {
  try {
    const { bankAccountId, expenses } = req.body;
    const totalAmount = Object.values(expenses).reduce(
      (sum, val) => sum + val,
      0
    );

    const account = await BankAccount.findOne({
      _id: bankAccountId,
      user: req.user.id,
    });
    if (!account) {
      return res.status(404).json({ error: "Bank account not found" });
    }

    if (account.balance < totalAmount) {
      return res
        .status(400)
        .json({ error: "Insufficient balance in selected account" });
    }

    // Deduct from the selected account
    account.balance -= totalAmount;
    await account.save();

    // Record each expense as a transaction
    const transactions = Object.entries(expenses)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        user: req.user.id,
        bankAccount: bankAccountId,
        description: `${category} expense`,
        category,
        amount,
        date: new Date(),
      }));

    await Transaction.insertMany(transactions);

    res.json({
      message: "Amount deducted and transactions recorded successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deducting amount", details: error.message });
  }
});

module.exports = router;
