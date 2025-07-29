const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/userModel");

const secret = process.env.JWT_SECRET;

const register = async (email, password) => {
  console.log(`[DEBUG] Register called for email: ${email} at ${new Date().toISOString()}`);
  const hashed = await bcrypt.hash(password, 10);
  console.log(`[DEBUG] Password hashed for email: ${email} at ${new Date().toISOString()}`);
  await createUser(email, hashed);
  console.log(`[DEBUG] User created for email: ${email} at ${new Date().toISOString()}`);
};

const login = async (email, password) => {
  console.log(`[DEBUG] Login called for email: ${email} at ${new Date().toISOString()}`);
  const user = await findUserByEmail(email);
  if (!user) {
    console.log(`[ERROR] User not found for email: ${email} at ${new Date().toISOString()}`);
    throw new Error("Utilizador não encontrado");
  }
  console.log(`[DEBUG] User found for email: ${email} at ${new Date().toISOString()}`);

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log(`[ERROR] Invalid password for email: ${email} at ${new Date().toISOString()}`);
    throw new Error("Senha inválida");
  }
  console.log(`[DEBUG] Password matched for email: ${email} at ${new Date().toISOString()}`);

  const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "2h" });
  console.log(`[DEBUG] JWT generated for email: ${email} at ${new Date().toISOString()}`);
  return token;
};

module.exports = { register, login };