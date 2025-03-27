const express = require("express");
const Transaction = require("../models/Transaction");
const authMiddleware  = require("../middleware/authMiddleware");

const router = express.Router();

// Get all transactions for the user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).populate(
      "bankAccount"
    );
    res.json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching transactions", details: error.message });
  }
});

// Delete a transaction
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting transaction", details: error.message });
  }
});

module.exports = router;
