const express = require("express");
const chalk = require("chalk");
const { yellow, green } = chalk;

const {
  sendDeleteCodeController,
  confirmDeleteUserController
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
const authenticateJWT = require("../middlewares/authJWTMiddleware");

const router = express.Router();

router.use((req, res, next) => {
  console.log(yellow(`[DEBUG] ${req.method} ${req.originalUrl} - Body: ${JSON.stringify(req.body)}`));
  next();
});

router.post("/delete/send-code", authMiddleware, sendDeleteCodeController);

router.post("/delete/confirm", authMiddleware, confirmDeleteUserController);

module.exports = router;
