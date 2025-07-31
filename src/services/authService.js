const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/userModel");
const { sendEmail } = require("../utils/mailer");

const secret = process.env.JWT_SECRET;

const verificationCodes = new Map();
const pendingUsers = new Map();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendVerificationCode = async (email, userData) => {
  email = email.toLowerCase();

  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error("Email já registado");

  const code = generateCode();
  verificationCodes.set(email, { code, expires: Date.now() + 10 * 60 * 1000 });
  pendingUsers.set(email, userData);

  const subject = "Seu código de verificação";
  const html = `<p>Olá ${userData.firstName},</p>
                <p>Seu código de verificação é: <b>${code}</b></p>
                <p>O código é válido por 10 minutos.</p>`;

  await sendEmail(email, subject, html);

  console.log(`Código de verificação enviado para ${email}: ${code} (válido 10 min)`);

  return true;
};

const verifyCodeAndRegister = async (email, code) => {
  email = email.toLowerCase();

  const data = verificationCodes.get(email);
  if (!data) return false;
  if (Date.now() > data.expires) {
    verificationCodes.delete(email);
    pendingUsers.delete(email);
    return false;
  }
  if (data.code !== code) return false;

  const userData = pendingUsers.get(email);
  if (!userData) return false;

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

  console.log(`User criado: ${email}`);

  return true;
};

const login = async (email, password) => {
  email = email.toLowerCase();

  const user = await findUserByEmail(email);
  if (!user) throw new Error("Utilizador não encontrado");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Senha inválida");

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

  console.log(`JWT gerado para: ${email}`);
  return token;
};

module.exports = {
  sendVerificationCode,
  verifyCodeAndRegister,
  login,
};
