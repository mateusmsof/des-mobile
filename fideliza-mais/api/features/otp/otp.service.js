const AppError = require('../../common/AppError');
const db = require('../../config/database');
const { Resend } = require('resend');

const RESEND_API_KEY = 're_6qL3WnoC_68eF2Jg8L9wWbaGkurctfGjr';
const resendClient = new Resend(RESEND_API_KEY);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const buildOtpEmailHtml = (code, email) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2 style="color: #227C9D; margin-bottom: 8px;">Seu código de acesso</h2>
      <p>Olá,</p>
      <p>Use o código abaixo para acessar o app Fideliza+:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 24px 0;">${code}</p>
      <p style="margin-bottom: 4px;">Esse código expira em 15 minutos.</p>
      <p style="color: #64748b; font-size: 14px;">Se você não solicitou este código, ignore esta mensagem.</p>
    </div>
  `;
};

exports.sendOTP = async (email, otpType) => {
  if (!email || typeof email !== 'string') {
    throw new AppError('E-mail inválido.', 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const otpCode = generateOTP();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

  await db.query(
    `INSERT INTO tb_otps (email, otp_code, is_used, expires_at)
     VALUES (?, ?, 0, ?)`,
    [normalizedEmail, otpCode, expiresAt]
  );

  try {
    const result = await resendClient.emails.send({
      from: 'Fideliza+ <onboarding@resend.dev>',
      to: normalizedEmail,
      subject: 'Seu código de acesso Fideliza+',
      html: buildOtpEmailHtml(otpCode, normalizedEmail),
    });

    console.log('OTP e-mail enviado via Resend:', {
      to: normalizedEmail,
      otpCode,
      resendId: result?.data?.id,
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail OTP:', error);
    throw new AppError('Não foi possível enviar o código por e-mail.', 502);
  }

  return {
    message: 'Código enviado para o seu e-mail. Verifique sua caixa de entrada.',
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