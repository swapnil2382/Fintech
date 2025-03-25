const express = require("express");
const { register, login } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
