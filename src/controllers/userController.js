const chalk = require("chalk");
const { yellow, green, red } = chalk;

const {
  sendDeleteVerificationCode,
  verifyCodeAndDeleteUser
} = require("../services/userService");

const sendDeleteCodeController = async (req, res) => {
  const { email } = req.body;
  try {
    console.log(yellow(`[DEBUG] Pedido de envio de código de eliminação para: ${email}`));
    await sendDeleteVerificationCode(email);
    res.status(200).send({ message: "Código de verificação enviado com sucesso" });
  } catch (err) {
    console.error(red(`[ERROR] Falha ao enviar código: ${err.message}`));
    res.status(400).send({ error: err.message });
  }
};

const confirmDeleteUserController = async (req, res) => {
  const { email, code } = req.body;
  try {
    console.log(yellow(`[DEBUG] Pedido de eliminação para: ${email} com código: ${code}`));
    const success = await verifyCodeAndDeleteUser(email, code);

    if (!success) {
      res.status(400).send({ error: "Código inválido ou expirado" });
      return;
    }

    res.status(200).send({ message: "Utilizador eliminado com sucesso" });
  } catch (err) {
    console.error(red(`[ERROR] Falha ao eliminar utilizador: ${err.message}`));
    res.status(400).send({ error: err.message });
  }
};

module.exports = {
  sendDeleteCodeController,
  confirmDeleteUserController
};
