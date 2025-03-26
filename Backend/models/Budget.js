const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  month: { type: String, required: true }, // e.g., "March 2025"
});

module.exports = mongoose.model("Budget", BudgetSchema);
