require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoute");

const app = express();
console.log("[DEBUG] App initialized:", new Date().toISOString());

app.use(cors());
console.log("[DEBUG] CORS enabled");

app.use(express.json());
console.log("[DEBUG] JSON parsing enabled");

app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
});

app.use("/api/auth", (req, res, next) => {
  console.log(`[DEBUG] Auth route: ${req.path} at ${new Date().toISOString()}`);
  next();
}, authRoutes);

app.listen(3001, () => {
  console.log("[DEBUG] Servidor na porta 3001:", new Date().toISOString());
});