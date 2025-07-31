const express = require("express");
const chalk = require("chalk");
const { yellow, green } = chalk;

const { registerController, loginController } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const authenticateJWT = require("../middlewares/authJWTMiddleware");

const router = express.Router();

router.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(yellow(`[DEBUG] ${req.method} request to ${req.originalUrl} at ${timestamp}`));
  console.log(yellow(`[DEBUG] Request body: ${JSON.stringify(req.body, null, 2)}`));
  next();
});

router.post("/register", authMiddleware, (req, res, next) => {
  console.log(yellow(`[DEBUG] Register route called at ${new Date().toISOString()}`));
  registerController(req, res, next);
});

router.post("/login", authMiddleware, (req, res, next) => {
  console.log(yellow(`[DEBUG] Login route called at ${new Date().toISOString()}`));
  loginController(req, res, next);
});

router.get("/validate", authenticateJWT, (req, res) => {
  console.log(green(`[SUCESS] Validate route accessed by user: ${req.user.email || 'N/A'} at ${new Date().toISOString()}`));
  res.json({ ok: true, user: req.user });
});

module.exports = router;
