const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const { yellow, green, red } = chalk;
const { findUserByEmail, createUser } = require("../models/userModel");

const secret = process.env.JWT_SECRET;



const register = async (name, email, password) => {
  const timestamp = new Date().toISOString();
  console.log(yellow(`[DEBUG] Register called for email: ${email} at ${timestamp}`));
  const hashed = await bcrypt.hash(password, 10);
  console.log(yellow(`[DEBUG] Password hashed for email: ${email} at ${timestamp}`));
  await createUser(name, email, hashed);
  console.log(green(`[SUCESS] User created for email: ${email} at ${timestamp}`));
};



const login = async (email, password) => {
  const timestamp = new Date().toISOString();
  console.log(yellow(`[DEBUG] Login called for email: ${email} at ${timestamp}`));
  const user = await findUserByEmail(email);
  if (!user) {
    console.log(red(`[ERROR] User not found for email: ${email} at ${timestamp}`));
    throw new Error("Utilizador não encontrado");
  }
  console.log(green(`[SUCESS] User found for email: ${email} at ${timestamp}`));

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log(red(`[ERROR] Invalid password for email: ${email} at ${timestamp}`));
    throw new Error("Senha inválida");
  }
  console.log(green(`[SUCESS] Password matched for email: ${email} at ${timestamp}`));

  const token = jwt.sign({ id: user.id, name:user.name, email: user.email }, secret, { expiresIn: "2h" });
  console.log(green(`[SUCESS] JWT generated for email: ${email} at ${timestamp}`));
  return token;
};

module.exports = { register, login };
