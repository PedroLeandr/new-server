const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/userModel");

const secret = process.env.JWT_SECRET;

const register = async (email, password) => {
  const hashed = await bcrypt.hash(password, 10);
  await createUser(email, hashed);
};

const login = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Utilizador não encontrado");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Senha inválida");

  const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "2h" });
  return token;
};

module.exports = { register, login };
