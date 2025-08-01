const express = require("express");
const chalk = require("chalk");
const { yellow, green } = chalk;

const {
  loginController,
  startRegisterController,
  verifyRegisterCodeController,
  startPasswordResetController,
  verifyPasswordResetCodeController
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");
const authenticateJWT = require("../middlewares/authJWTMiddleware");

const router = express.Router();

router.use((req, res, next) => {
  console.log(yellow(`[DEBUG] ${req.method} ${req.originalUrl} - Body: ${JSON.stringify(req.body)}`));
  next();
});

router.post("/start-register", startRegisterController);

router.post("/verify-register-code", verifyRegisterCodeController);



router.post("/start-password-reset", startPasswordResetController);

router.post("/verify-password-reset-code", verifyPasswordResetCodeController);



router.post("/login", authMiddleware, loginController);

router.get("/validate", authenticateJWT, (req, res) => {
  console.log(green(`[SUCCESS] Validate accessed by ${req.user.email}`));
  res.json({ ok: true, user: req.user });
});

module.exports = router;
