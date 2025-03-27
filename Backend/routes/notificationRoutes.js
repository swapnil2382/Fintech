const express = require("express");
const Notification = require("../models/Notification");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all notifications for the user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate("transaction")
      .sort({ date: -1 });
    res.json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching notifications", details: error.message });
  }
});

// Mark a notification as read
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({
      error: "Error marking notification as read",
      details: error.message,
    });
  }
});

module.exports = router;
