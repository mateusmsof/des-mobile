const AppError = require('../../common/AppError');
const db = require('../../config/database');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOTP = async (email, otpType) => {
  if (!email || typeof email !== 'string') {
    throw new AppError('E-mail inválido.', 400);
  }

  const otpCode = generateOTP();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

  await db.query(
    `INSERT INTO tb_otps (email, otp_code, is_used, expires_at)
     VALUES (?, ?, 0, ?)`,
    [email.trim().toLowerCase(), otpCode, expiresAt]
  );

  return {
    message: 'OTP enviado com sucesso. Para demonstração, use o código 123456 ou o último código enviado.',
    otpCode,
    type: otpType || 'login',
  };
};

exports.verifyOTP = async (email, otpCode) => {
  if (!email || !otpCode) {
    throw new AppError('E-mail e código são obrigatórios.', 400);
  }

  const [rows] = await db.query(
    `SELECT id
     FROM tb_otps
     WHERE email = ?
       AND otp_code = ?
       AND is_used = 0
       AND expires_at >= NOW()
     ORDER BY created_at DESC
     LIMIT 1`,
    [email.trim().toLowerCase(), otpCode.trim()]
  );

  if (!rows || rows.length === 0) {
    throw new AppError('Código inválido ou expirado.', 401);
  }

  const otp = rows[0];
  await db.query('UPDATE tb_otps SET is_used = 1 WHERE id = ?', [otp.id]);

  return { valid: true };
};

/*
const services = {
    async generateAndSendOtp(email) {

    },

    async verifyAndConsumeOtp(email, code, type) {

    },
};

*/

//module.exports = services;