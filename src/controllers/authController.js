const { register, login } = require("../services/authService");

const registerController = async (req, res) => {
  try {
    const { email, password } = req.body;
    await register(email, password);
    res.status(201).send({ message: "Utilizador criado" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);
    res.send({ token });
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
};

module.exports = { registerController, loginController };
