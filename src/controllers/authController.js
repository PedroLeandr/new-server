const { register, login } = require("../services/authService");

const registerController = async (req, res) => {
  console.log(`[DEBUG] registerController called for email: ${req.body.email} at ${new Date().toISOString()}`);
  try {
    const { email, password } = req.body;
    console.log(`[DEBUG] Processing registration for email: ${email} at ${new Date().toISOString()}`);
    await register(email, password);
    console.log(`[DEBUG] Registration successful for email: ${email} at ${new Date().toISOString()}`);
    res.status(201).send({ message: "Utilizador criado" });
    console.log(`[DEBUG] Response sent: Status 201 for email: ${email} at ${new Date().toISOString()}`);
  } catch (err) {
    console.log(`[ERROR] Registration failed for email: ${req.body.email}, Error: ${err.message} at ${new Date().toISOString()}`);
    res.status(400).send({ error: err.message });
    console.log(`[DEBUG] Error response sent: Status 400 for email: ${req.body.email} at ${new Date().toISOString()}`);
  }
};

const loginController = async (req, res) => {
  console.log(`[DEBUG] loginController called for email: ${req.body.email} at ${new Date().toISOString()}`);
  try {
    const { email, password } = req.body;
    console.log(`[DEBUG] Processing login for email: ${email} at ${new Date().toISOString()}`);
    const token = await login(email, password);
    console.log(`[DEBUG] Login successful for email: ${email} at ${new Date().toISOString()}`);
    res.send({ token });
    console.log(`[DEBUG] Response sent: Token issued for email: ${email} at ${new Date().toISOString()}`);
  } catch (err) {
    console.log(`[ERROR] Login failed for email: ${req.body.email}, Error: ${err.message} at ${new Date().toISOString()}`);
    res.status(401).send({ error: err.message });
    console.log(`[DEBUG] Error response sent: Status 401 for email: ${req.body.email} at ${new Date().toISOString()}`);
  }
};

module.exports = { registerController, loginController };