const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");
const router = express.Router();

router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const bankAccountId = req.query.bankAccountId;
    console.log("User ID:", req.user.id, "Bank Account ID:", bankAccountId || "None provided");

    // Fetch all transactions
    let transactions = [];
    try {
      const transactionsResponse = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      transactions = transactionsResponse.data || [];
      console.log("Raw transactions:", transactions.map(txn => ({ _id: txn._id, amount: txn.amount, type: txn.type, bankAccount: txn.bankAccount?._id || txn.bankAccount, category: txn.category })));
    } catch (error) {
      console.error("Failed to fetch transactions:", error.message);
    }

    // Filter incomes
    let incomes = transactions.filter(txn => txn.type === "income");
    console.log("Incomes before filter:", incomes.map(inc => ({ _id: inc._id, amount: inc.amount, bankAccount: inc.bankAccount?._id || inc.bankAccount })));
    if (bankAccountId) {
      incomes = incomes.filter((inc) => (inc.bankAccount._id || inc.bankAccount).toString() === bankAccountId);
    }
    console.log("Filtered incomes:", incomes.map(inc => ({ _id: inc._id, amount: inc.amount, bankAccount: inc.bankAccount?._id || inc.bankAccount })));
    const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0);
    console.log("Total Income:", totalIncome);

    // Filter expenses
    let expenses = transactions.filter(txn => txn.type === "expense");
    console.log("Expenses before filter:", expenses.map(exp => ({ _id: exp._id, amount: exp.amount, category: exp.category, bankAccount: exp.bankAccount?._id || exp.bankAccount })));
    if (bankAccountId) {
      expenses = expenses.filter((exp) => (exp.bankAccount._id || exp.bankAccount).toString() === bankAccountId);
    }
    console.log("Filtered expenses:", expenses.map(exp => ({ _id: exp._id, amount: exp.amount, category: exp.category, bankAccount: exp.bankAccount?._id || exp.bankAccount })));
    const deductibleTransactions = expenses
      .filter((exp) => ["Rent", "Transport"].includes(exp.category))
      .reduce((sum, exp) => sum + (exp.amount || 0), 0);
    console.log("Deductible transactions:", deductibleTransactions);

    const taxableIncome = Math.max(totalIncome - deductibleTransactions, 0);
    let tax = 0;
    if (taxableIncome <= 50000) tax = taxableIncome * 0.1;
    else tax = 5000 + (taxableIncome - 50000) * 0.2;

    const deductionInsight =
      deductibleTransactions > 0
        ? `Your ₹${deductibleTransactions} in deductible transactions (e.g., Rent, Transport) reduced your tax by ₹${(deductibleTransactions * 0.1).toFixed(2)}.`
        : "Add deductible transactions (e.g., Rent, Transport) to lower your tax.";

    const userResponse = await axios.get("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = userResponse.data;

    const formData = {
      name: user.name || "User Name",
      income: totalIncome,
      deductions: deductibleTransactions,
      taxableIncome,
      taxDue: tax,
      filingDate: new Date().toLocaleDateString(),
      bankAccountId: bankAccountId || "All Accounts",
    };

    const response = {
      totalIncome,
      deductibleTransactions,
      taxableIncome,
      estimatedTax: tax,
      deductionInsight,
      formData,
    };
    console.log("Final response:", response);
    res.json(response);
  } catch (error) {
    console.error("Error calculating tax summary:", error.message, error.stack);
    res.status(500).json({ error: "Error calculating tax summary", details: error.message });
  }
});

module.exports = router;