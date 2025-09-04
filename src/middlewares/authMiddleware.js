const chalk = require("chalk")
const { yellow, red, green } = chalk

function authMiddleware(req, res, next) {
  const timestamp = new Date().toISOString()
  const { password } = req.body
  console.log(yellow(`[DEBUG] authMiddleware called at ${timestamp}`))

  if (!password) {
    console.log(red(`[ERROR] Password not provided at ${timestamp}`))
    return res.status(400).json({ error: 'Senha não fornecida' })
  }

  const senhaSegura = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{9,}$/
  if (!senhaSegura.test(password)) {
    console.log(red(`[ERROR] Weak password at ${timestamp}`))
    return res.status(400).json({
      error: 'A senha deve ter pelo menos 9 caracteres, incluindo letras, números e símbolos',
    })
  }

  console.log(green(`[SUCCESS] Password validated at ${timestamp}`))
  next()
}

module.exports = authMiddleware
