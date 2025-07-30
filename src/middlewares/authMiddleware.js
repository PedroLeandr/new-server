function authMiddleware(req, res, next) {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Senha não fornecida' });
  }

  const senhaSegura = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{9,}$/;
  if (!senhaSegura.test(password)) {
    return res.status(400).json({
      message: 'A senha deve ter pelo menos 9 caracteres, incluindo letras, números e símbolos',
    });
  }

  const sqlInjectionPadroes = [
    `'`, `"`, `--`, `;`, `/*`, `*/`, ` or `, ` and `, `=`, `1=1`, `drop`, `insert`, `select`, `update`, `delete`
  ];

  const senhaMinuscula = password.toLowerCase();
  if (sqlInjectionPadroes.some(padrao => senhaMinuscula.includes(padrao))) {
    return res.status(400).json({
      message: 'A senha contém padrões inválidos ou perigosos',
    });
  }

  next();
}

module.exports = authMiddleware;
