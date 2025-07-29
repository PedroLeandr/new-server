const db = require("../config/db");

const findUserByEmail = async (email) => {
  console.log(`[DEBUG] findUserByEmail called for email: ${email} at ${new Date().toISOString()}`);
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  console.log(`[DEBUG] findUserByEmail result for ${email}: ${rows[0] ? 'User found' : 'No user found'} at ${new Date().toISOString()}`);
  return rows[0];
};

const createUser = async (email, hashedPassword) => {
  console.log(`[DEBUG] createUser called for email: ${email} at ${new Date().toISOString()}`);
  await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);
  console.log(`[DEBUG] User created for email: ${email} at ${new Date().toISOString()}`);
};

module.exports = { findUserByEmail, createUser };