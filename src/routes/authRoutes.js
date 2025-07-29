const express = require("express");
const { registerController, loginController } = require("../controllers/authController");

const router = express.Router();
console.log("[DEBUG] Auth router initialized at", new Date().toISOString());

// Middleware to log incoming requests
router.use((req, res, next) => {
  console.log(
    `[DEBUG] ${req.method} request to ${req.originalUrl} at`,
    new Date().toISOString()
  );
  console.log("[DEBUG] Request body:", JSON.stringify(req.body, null, 2));
  next();
});

router.post("/register", (req, res, next) => {
  console.log("[DEBUG] Register route called at", new Date().toISOString());
  registerController(req, res, next);
});

router.post("/login", (req, res, next) => {
  console.log("[DEBUG] Login route called at", new Date().toISOString());
  loginController(req, res, next);
});

module.exports = router;