const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["anomaly", "behavior", "budget_exceed"],
    required: true,
  }, // Add "budget_exceed"
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: function () {
      return this.type !== "budget_exceed"; // Transaction is required only for "anomaly" and "behavior"
    },
  },
  category: { type: String }, // Add category field for budget exceed notifications
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", notificationSchema);
