const chalk = require("chalk");
const { yellow, red, green } = chalk;

function authMiddleware(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(yellow(`[DEBUG] authMiddleware called for email: ${req.body.email || 'N/A'} at ${timestamp}`));

  const { password } = req.body;

  if (!password) {
    console.log(red(`[ERROR] Password not provided for email: ${req.body.email || 'N/A'} at ${timestamp}`));
    res.status(400).json({ error: 'Senha não fornecida' });
    console.log(yellow(`[DEBUG] Error response sent: Status 400 (missing password) at ${timestamp}`));
    return;
  }

  console.log(yellow(`[DEBUG] Validating password strength at ${timestamp}`));
  const senhaSegura = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{9,}$/;
  if (!senhaSegura.test(password)) {
    console.log(red(`[ERROR] Weak password detected for email: ${req.body.email || 'N/A'} at ${timestamp}`));
    res.status(400).json({
      error: 'A senha deve ter pelo menos 9 caracteres, incluindo letras, números e símbolos',
    });
    console.log(yellow(`[DEBUG] Error response sent: Status 400 (weak password) at ${timestamp}`));
    return;
  }

  console.log(yellow(`[DEBUG] Checking password for SQL injection patterns at ${timestamp}`));
  const sqlInjectionPadroes = [
    `'`, `"`, `--`, `;`, `/*`, `*/`, ` or `, ` and `, `=`, `1=1`, `drop`, `insert`, `select`, `update`, `delete`
  ];

  const senhaMinuscula = password.toLowerCase();
  if (sqlInjectionPadroes.some(padrao => senhaMinuscula.includes(padrao))) {
    console.log(red(`[ERROR] SQL injection pattern detected in password for email: ${req.body.email || 'N/A'} at ${timestamp}`));
    res.status(400).json({
      error: 'A senha contém padrões inválidos ou perigosos',
    });
    console.log(yellow(`[DEBUG] Error response sent: Status 400 (SQL pattern detected) at ${timestamp}`));
    return;
  }

  console.log(green(`[SUCESS] Password passed all checks for email: ${req.body.email || 'N/A'} at ${timestamp}`));
  next();
}

module.exports = authMiddleware;
