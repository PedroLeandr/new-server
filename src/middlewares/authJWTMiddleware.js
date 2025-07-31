const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const { red, yellow, green } = chalk;

const secret = process.env.JWT_SECRET;

function authenticateJWT(req, res, next) {
  console.log(yellow(`[DEBUG] authenticateJWT called at ${new Date().toISOString()}`));

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    console.log(red(`[ERROR] Token ausente at ${new Date().toISOString()}`));
    return res.status(401).json({ error: "Token ausente" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    console.log(green(`[SUCESS] Token verificado com sucesso at ${new Date().toISOString()}`));
    next();
  } catch (err) {
    console.log(red(`[ERROR] Token inválido at ${new Date().toISOString()}`));
    return res.status(403).json({ error: "Token inválido" });
  }
}

module.exports = authenticateJWT;
