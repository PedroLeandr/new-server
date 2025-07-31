const {
  sendVerificationCode,
  verifyCodeAndRegister,
  login
} = require("../services/authService");

const chalk = require("chalk");
const { yellow, green, red } = chalk;

const startRegisterController = async (req, res) => {
  const userData = req.body;
  try {
    await sendVerificationCode(userData.email, userData);
    res.status(200).send({ message: "Código de verificação enviado para o email" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const verifyCodeController = async (req, res) => {
  const { email, code } = req.body;
  try {
    const success = await verifyCodeAndRegister(email, code);
    if (!success) return res.status(400).send({ error: "Código inválido ou expirado" });
    res.status(201).send({ message: "Registo confirmado e utilizador criado" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await login(email, password);
    res.json({ token });
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
};

module.exports = {
  startRegisterController,
  verifyCodeController,
  loginController,
};
