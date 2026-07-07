//const otpModel = require('./model');
const AppError = require('../common/AppError');
const { Resend } = require('resend');
//const db = require('../db'); // Assumindo pool do Mysql2 ou similar para conexões.
const db = require('../config/database'); // Conexão com o banco de dados, usando um pool de conexões.
require('dotenv').config({path: './config/.env'});

const resend = new Resend(process.env.RESEND_API_KEY);

// Geração de código de 6 dígitos apenas com números.
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();

};

exports.sendOTP = async (email, otpType) => { 
    const otpCode = generateOTP();
    const expirationsMinutes = 15; 

    // Registra OTP no banco de dados.
    await db.query('CALL sp_create_otp(?, ?, ?, ?, @status)', [email, otpCode, otpType, expirationsMinutes]);
    const [rows] = await db.query('SELECT @status AS status');
    const status = rows[0].status;

    if (status !== 'SUCESSO') { // [cite: 71, 159]
        if (status === 'OTP_CODE_CONFLICT') { // [cite: 72]
            throw new AppError('Aguarde antes de solicitar um novo código.', 429);
        }
        throw new AppError('Erro interno no banco.', 500); // ERRO_TECNICO [cite: 73]
    }

    // Template simples e profissional com apenas o código.
    const { error } = await resend.emails.send({
        from: 'LeiClara <onboarding@resend.dev>',
        to: [email],
        subject: 'Código de Verificação - LeiClara',
        html: `<p>Seu código de acesso é: <strong>${otpCode}</strong></p>`
    });

    if (error) {
        throw new AppError('Falha no disparo do e-mail.', 500);
        
    };

    // Corrigido: typo e fechamento da função.
    return{ message: 'OTP enviado com sucesso.' };
};

// A função verifyOTP agora está no escopo correto (solta no arquivo).
// Corrigido: O parâmetro agora é otpCode, batendo com o com o Controller. 

exports.verifyOTP = async (email, otpCode) => {
        // Valida e consome OTP no banco de dados.
        await db.query('CALL sp_use_otp(?, ?, @status)', [email, otpCode]);
        const [rows] = await db.query('SELECT @status AS status');
        const status = rows[0].status;
    

    // Corrigido: As regras de status agora estão DENTRO da função.
    if (status === 'SUCESSO') return { valid: true };
    if (status === 'OTP_INVALIDO') throw new AppError('Código inválido ou já usado.', 401);
    if (status === 'OTP_EXPIRADO') throw new AppError('Código expirado.', 401);

    throw new AppError('Erro técnico na validação.', 500); // ERRO_TECNICO

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