function authMiddleware(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[DEBUG] authMiddleware called for email: ${req.body.email || 'N/A'} at ${timestamp}`);

  const { password } = req.body;

  if (!password) {
    console.log(`[ERROR] Password not provided for email: ${req.body.email || 'N/A'} at ${timestamp}`);
    res.status(400).json({ error: 'Senha não fornecida' });
    console.log(`[DEBUG] Error response sent: Status 400 (missing password) at ${timestamp}`);
    return;
  }

  console.log(`[DEBUG] Validating password strength at ${timestamp}`);
  const senhaSegura = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{9,}$/;
  if (!senhaSegura.test(password)) {
    console.log(`[ERROR] Weak password detected for email: ${req.body.email || 'N/A'} at ${timestamp}`);
    res.status(400).json({
      error: 'A senha deve ter pelo menos 9 caracteres, incluindo letras, números e símbolos',
    });
    console.log(`[DEBUG] Error response sent: Status 400 (weak password) at ${timestamp}`);
    return;
  }

  console.log(`[DEBUG] Checking password for SQL injection patterns at ${timestamp}`);
  const sqlInjectionPadroes = [
    `'`, `"`, `--`, `;`, `/*`, `*/`, ` or `, ` and `, `=`, `1=1`, `drop`, `insert`, `select`, `update`, `delete`
  ];

  const senhaMinuscula = password.toLowerCase();
  if (sqlInjectionPadroes.some(padrao => senhaMinuscula.includes(padrao))) {
    console.log(`[ERROR] SQL injection pattern detected in password for email: ${req.body.email || 'N/A'} at ${timestamp}`);
    res.status(400).json({
      error: 'A senha contém padrões inválidos ou perigosos',
    });
    console.log(`[DEBUG] Error response sent: Status 400 (SQL pattern detected) at ${timestamp}`);
    return;
  }

  console.log(`[DEBUG] Password passed all checks for email: ${req.body.email || 'N/A'} at ${timestamp}`);
  next();
}

module.exports = authMiddleware;
