const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser, changeUserPassword } = require("../models/userModel");
const { sendEmail } = require("../utils/mailer");

const secret = process.env.JWT_SECRET;

const verificationCodes = new Map();
const pendingUsers = new Map();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendVerificationRegisterCode = async (email, userData) => {
  try {
    console.debug("[sendVerificationRegisterCode] Email:", email);
    console.debug("[sendVerificationRegisterCode] Dados:", userData);

    email = email.toLowerCase();
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.warn(`[sendVerificationRegisterCode] Email já registado: ${email}`);
      throw new Error("Email já registado");
    }

    const code = generateCode();
    verificationCodes.set(email, { code, expires: Date.now() + 10 * 60 * 1000 });
    pendingUsers.set(email, userData);

    const subject = "Seu código de verificação";
    const html = `<p>Olá ${userData.firstName},</p><p>Seu código de verificação é: <b>${code}</b></p><p>O código é válido por 10 minutos.</p>`;

    await sendEmail(email, subject, html);

    console.log(`[sendVerificationRegisterCode] Código de verificação enviado para ${email}: ${code}`);
    return true;
  } catch (err) {
    console.error("[sendVerificationRegisterCode] Erro:", err.message);
    throw err;
  }
};

const verifyCodeAndRegister = async (email, code) => {
  try {
    console.debug("[verifyCodeAndRegister] Email:", email);
    console.debug("[verifyCodeAndRegister] Código recebido:", code);

    email = email.toLowerCase();
    const data = verificationCodes.get(email);

    if (!data) {
      console.warn("[verifyCodeAndRegister] Código não encontrado.");
      return false;
    }

    if (Date.now() > data.expires) {
      console.warn("[verifyCodeAndRegister] Código expirado.");
      verificationCodes.delete(email);
      pendingUsers.delete(email);
      return false;
    }

    if (data.code !== code) {
      console.warn("[verifyCodeAndRegister] Código inválido.");
      return false;
    }

    const userData = pendingUsers.get(email);
    if (!userData) {
      console.warn("[verifyCodeAndRegister] Dados do utilizador não encontrados.");
      return false;
    }

    const hashed = await bcrypt.hash(userData.password, 10);
    await createUser(
      userData.firstName,
      userData.surname,
      userData.companyName,
      userData.countryCode,
      userData.phone,
      email,
      hashed,
      userData.plan
    );

    verificationCodes.delete(email);
    pendingUsers.delete(email);

    console.log(`[verifyCodeAndRegister] Utilizador criado com sucesso: ${email}`);
    return true;
  } catch (err) {
    console.error("[verifyCodeAndRegister] Erro:", err.message);
    throw err;
  }
};

const sendVerificationPasswordResetCode = async (email, userData) => {
  try {
    console.debug("[sendVerificationPasswordResetCode] Email:", email);

    email = email.toLowerCase();
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      console.warn(`[sendVerificationPasswordResetCode] Email não encontrado: ${email}`);
      throw new Error("Email não registado");
    }

    const code = generateCode();
    verificationCodes.set(email, { code, expires: Date.now() + 10 * 60 * 1000 });
    pendingUsers.set(email, userData);

    const subject = "Seu código de verificação";
    const html = `<p>Olá ${userData.firstName},</p><p>Seu código de verificação é: <b>${code}</b></p><p>O código é válido por 10 minutos.</p>`;

    await sendEmail(email, subject, html);

    console.log(`[sendVerificationPasswordResetCode] Código enviado para ${email}: ${code}`);
    return true;
  } catch (err) {
    console.error("[sendVerificationPasswordResetCode] Erro:", err.message);
    throw err;
  }
};

const verifyCodeForResetPassword = async (email, newPassword, code) => {
  try {
    console.debug("[verifyCodeForResetPassword] Email:", email);
    console.debug("[verifyCodeForResetPassword] Código:", code);

    email = email.toLowerCase();
    const data = verificationCodes.get(email);

    if (!data) {
      console.warn("[verifyCodeForResetPassword] Código não encontrado.");
      return false;
    }

    if (Date.now() > data.expires) {
      console.warn("[verifyCodeForResetPassword] Código expirado.");
      verificationCodes.delete(email);
      pendingUsers.delete(email);
      return false;
    }

    if (data.code !== code) {
      console.warn("[verifyCodeForResetPassword] Código inválido.");
      return false;
    }

    const userData = pendingUsers.get(email);
    if (!userData) {
      console.warn("[verifyCodeForResetPassword] Dados pendentes não encontrados.");
      return false;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await changeUserPassword(email, hashed);

    verificationCodes.delete(email);
    pendingUsers.delete(email);

    console.log(`[verifyCodeForResetPassword] Senha redefinida para: ${email}`);
    return true;
  } catch (err) {
    console.error("[verifyCodeForResetPassword] Erro:", err.message);
    throw err;
  }
};

const login = async (email, password) => {
  try {
    console.debug("[login] Email:", email);

    email = email.toLowerCase();
    const user = await findUserByEmail(email);
    if (!user) {
      console.warn(`[login] Utilizador não encontrado: ${email}`);
      throw new Error("Utilizador não encontrado");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.warn(`[login] Senha incorreta para: ${email}`);
      throw new Error("Senha inválida");
    }

    const token = jwt.sign({
      id: user.id,
      firstName: user.first_name,
      surname: user.surname,
      companyName: user.company_name,
      countryCode: user.country_code,
      phone: user.phone,
      email: user.email,
      plan: user.plan,
      createdAt: user.created_at
    }, secret, { expiresIn: "2h" });

    console.log(`[login] JWT gerado para: ${email}`);
    return token;
  } catch (err) {
    console.error("[login] Erro:", err.message);
    throw err;
  }
};

module.exports = {
  sendVerificationRegisterCode,
  verifyCodeAndRegister,
  sendVerificationPasswordResetCode,
  verifyCodeForResetPassword,
  login,
};
