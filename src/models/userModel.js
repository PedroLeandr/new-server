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

const createUser = async (firstName, surname, companyName, countryCode, phone, email, hashedPassword, plan) => {
  const timestamp = new Date().toISOString();
  console.log(yellow(`[DEBUG] createUser called for email: ${email} at ${timestamp}`));
  await db.query("INSERT INTO users (first_name, surname, company_name, country_code, phone, email, password, plan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [firstName, surname, companyName, countryCode, phone, email, hashedPassword, plan]);
  console.log(green(`[SUCESS] User ${firstName} ${surname} created for email: ${email} at ${timestamp}`));
};

module.exports = { findUserByEmail, createUser };
