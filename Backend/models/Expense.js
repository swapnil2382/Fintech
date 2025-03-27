const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true, default: "Uncategorized" },
    description: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


module.exports = {
  Expense: mongoose.model("Expense", ExpenseSchema),
};
