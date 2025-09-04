const { deleteUser: deleteUserFromDB, findUserByEmail } = require("../models/userModel");
const { sendEmail } = require("../utils/mailer");

const deleteVerificationCodes = new Map();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendDeleteVerificationCode = async (email) => {
  try {
    console.debug("[sendDeleteVerificationCode] Email:", email);

    email = email.toLowerCase();
    const user = await findUserByEmail(email);
    if (!user) {
      console.warn(`[sendDeleteVerificationCode] Utilizador não encontrado: ${email}`);
      throw new Error("Utilizador não encontrado");
    }

    const code = generateCode();
    deleteVerificationCodes.set(email, { code, expires: Date.now() + 10 * 60 * 1000 });

    const subject = "Código para apagar a conta";
    const html = `<p>Olá ${user.first_name},</p><p>Seu código de confirmação para apagar a conta é: <b>${code}</b></p><p>Este código expira em 10 minutos.</p>`;

    await sendEmail(email, subject, html);
    console.log(`[sendDeleteVerificationCode] Código de verificação enviado para ${email}: ${code}`);
    return true;
  } catch (err) {
    console.error("[sendDeleteVerificationCode] Erro:", err.message);
    throw err;
  }
};

const verifyCodeAndDeleteUser = async (email, code) => {
  try {
    console.debug("[verifyCodeAndDeleteUser] Email:", email);
    console.debug("[verifyCodeAndDeleteUser] Código recebido:", code);

    email = email.toLowerCase();
    const data = deleteVerificationCodes.get(email);

    if (!data) {
      console.warn("[verifyCodeAndDeleteUser] Código não encontrado.");
      return false;
    }

    if (Date.now() > data.expires) {
      console.warn("[verifyCodeAndDeleteUser] Código expirado.");
      deleteVerificationCodes.delete(email);
      return false;
    }

    if (data.code !== code) {
      console.warn("[verifyCodeAndDeleteUser] Código inválido.");
      return false;
    }

    await deleteUserFromDB(email);
    deleteVerificationCodes.delete(email);

    console.log(`[verifyCodeAndDeleteUser] Conta apagada com sucesso: ${email}`);
    return true;
  } catch (err) {
    console.error("[verifyCodeAndDeleteUser] Erro:", err.message);
    throw err;
  }
};

module.exports = {
  sendDeleteVerificationCode,
  verifyCodeAndDeleteUser
};
