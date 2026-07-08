const jwt = require('jsonwebtoken');
const AppError = require('../common/AppError');
const db = require('../config/database');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token de autenticação ausente.', 401));
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'fideliza_mais_secret');
    const [rows] = await db.query('SELECT id, email FROM tb_users WHERE id = ?', [payload.userId]);

    if (!rows || rows.length === 0) {
      return next(new AppError('Usuário não encontrado.', 401));
    }

    req.user = {
      id: rows[0].id,
      email: rows[0].email,
      customerId: payload.customerId,
      displayName: payload.displayName,
    };

    return next();
  } catch (error) {
    return next(new AppError('Token inválido ou expirado.', 401));
  }
};
