const db = require("../config/db");
const chalk = require("chalk");
const { yellow, red, green } = chalk;

const findUserByEmail = async (email) => {
  const timestamp = new Date().toISOString();
  console.log(yellow(`[DEBUG] findUserByEmail called for email: ${email} at ${timestamp}`));
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  if (rows[0]) {
    console.log(green(`[SUCESS] User found for email: ${email} at ${timestamp}`));
  } else {
    console.log(red(`[ERROR] No user found for email: ${email} at ${timestamp}`));
  }

  return rows[0];
};

const createUser = async (name, email, hashedPassword) => {
  const timestamp = new Date().toISOString();
  console.log(yellow(`[DEBUG] createUser called for email: ${email} at ${timestamp}`));
  await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);
  console.log(green(`[SUCESS] User ${name} created for email: ${email} at ${timestamp}`));
};

module.exports = { findUserByEmail, createUser };
