const {
  sendVerificationRegisterCode,
  verifyCodeAndRegister,
  sendVerificationPasswordResetCode,
  verifyCodeForResetPassword,
  loginSendVerificationCode,
  verifyCodeAndLogin,
} = require("../services/authService");

const chalk = require("chalk");
const { yellow, green, red } = chalk;

const startRegisterController = async (req, res) => {
  const userData = req.body;
  try {
    await sendVerificationRegisterCode(userData.email, userData);
    res.status(200).send({ message: "Código de verificação enviado para o email" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const verifyRegisterCodeController = async (req, res) => {
  const { email, code } = req.body;
  try {
    const success = await verifyCodeAndRegister(email, code);
    if (!success) return res.status(400).send({ error: "Código inválido ou expirado" });
    res.status(201).send({ message: "Registo confirmado e utilizador criado" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};



const startPasswordResetController = async (req, res) => {
  const userData = req.body;
  try {
    await sendVerificationPasswordResetCode(userData.email, userData);
    res.status(200).send({ message: "Código de verificação enviado para o email" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const verifyPasswordResetCodeController = async (req, res) => {
  const { email, newPassword, code } = req.body;
  try {
    const success = await verifyCodeForResetPassword(email, newPassword, code);
    if (!success) return res.status(400).send({ error: "Código inválido ou expirado" });
    try {
      await verifyCodeForResetPassword(email, newPassword, code);
      console.log(green(`[SUCCESS] Password reset for ${email} at ${new Date().toISOString()}`));
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }
    res.status(201).send({ message: "Registo confirmado e utilizador criado" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};



const startLoginController = async (req, res) => {
  const { email } = req.body;
  try {
    await loginSendVerificationCode(email);
    res.status(200).send({ message: "Código de verificação enviado para o email" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const verifyLoginCodeController = async (req, res) => {
  const { email, password, code } = req.body;
  try {
    const token = await verifyCodeAndLogin(email, password, code);
    res.json({ token });
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
};


module.exports = {
  startRegisterController,
  verifyRegisterCodeController,
  startPasswordResetController,
  verifyPasswordResetCodeController,
  startLoginController,
  verifyLoginCodeController,
};
