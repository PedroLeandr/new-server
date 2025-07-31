const { register, login } = require("../services/authService");
const chalk = require("chalk");
const { red, yellow, green } = chalk;

const registerController = async (req, res) => {
  console.log(yellow(`[DEBUG] registerController called for email: ${req.body.email} at ${new Date().toISOString()}`));
  try {
    const { name, email, password } = req.body;
    console.log(yellow(`[DEBUG] Processing registration for email: ${email} at ${new Date().toISOString()}`));
    await register(name, email, password);
    console.log(green(`[SUCESS] Registration successful for email: ${email} at ${new Date().toISOString()}`));
    res.status(201).send({ message: "Utilizador criado" });
    console.log(yellow(`[DEBUG] Response sent: Status 201 for email: ${email} at ${new Date().toISOString()}`));
  } catch (err) {
    console.log(red(`[ERROR] Registration failed for email: ${req.body.email}, Error: ${err.message} at ${new Date().toISOString()}`));
    res.status(400).send({ error: err.message });
    console.log(red(`[ERROR] Error response sent: Status 400 for email: ${req.body.email} at ${new Date().toISOString()}`));
  }
};

const loginController = async (req, res) => {
  console.log(yellow(`[DEBUG] loginController called for email: ${req.body.email} at ${new Date().toISOString()}`));
  try {
    const { email, password } = req.body;
    console.log(yellow(`[DEBUG] Processing login for email: ${email} at ${new Date().toISOString()}`));
    const token = await login(email, password);
    console.log(green(`[SUCESS] Login successful for email: ${email} at ${new Date().toISOString()}`));
    res.send({ token });
    console.log(yellow(`[DEBUG] Response sent: Token issued for email: ${email} at ${new Date().toISOString()}`));
  } catch (err) {
    console.log(red(`[ERROR] Login failed for email: ${req.body.email}, Error: ${err.message} at ${new Date().toISOString()}`));
    res.status(401).send({ error: err.message });
    console.log(red(`[ERROR] Error response sent: Status 401 for email: ${req.body.email} at ${new Date().toISOString()}`));
  }
};

module.exports = { registerController, loginController };
