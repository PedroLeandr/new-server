require("dotenv").config();
const express = require("express");
const cors = require("cors");
const chalk = require("chalk");

const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");

const { yellow, green } = chalk;

const app = express();
console.log(yellow("[DEBUG] App initialized:"), new Date().toISOString());

app.use(cors());
console.log(yellow("[DEBUG] CORS enabled"));

app.use(express.json());
console.log(yellow("[DEBUG] JSON parsing enabled"));

app.use((req, res, next) => {
  console.log(yellow(`[DEBUG] ${req.method} ${req.url} at ${new Date().toISOString()}`));
  next();
});

app.use("/api/auth", (req, res, next) => {
  console.log(yellow(`[DEBUG] Auth route: ${req.path} at ${new Date().toISOString()}`));
  next();
}, authRoutes);

app.use("/api/user", (req, res, next) => {
  console.log(yellow(`[DEBUG] User route: ${req.path} at ${new Date().toISOString()}`));
  next();
}, userRoutes);

app.listen(3001, () => {
  console.log(green("[SUCESS] Servidor na porta 3001:"), new Date().toISOString());
});
