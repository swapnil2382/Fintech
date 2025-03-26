const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  remainingBudget: { type: Number }, // ✅ Make sure this is NOT default 0
  month: { type: String, required: true } // e.g., "March 2025"
});

// ✅ If a budget is created, set remainingBudget = limit
BudgetSchema.pre("save", function (next) {
  if (this.isNew) {
    this.remainingBudget = this.limit;
  }
  next();
});

const Budget = mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);

module.exports = Budget;
