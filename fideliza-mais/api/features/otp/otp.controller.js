const catchAsync = require('../common/catchAsync');
const otpService = require('./otp.service');

/**
 * Controller: Orquestrador (Ponte entre HTTP e Lógica)
 * Responsável por: res.status().json() e extrair dados da req.
 */

/**
 * Endpoint para solicitar o envio de um novo código OTP;
 * 
 */

exports.sendOtp = catchAsync(async (req, res, next) => {
    // Extração de dados do corpo da requisição.
    const { email, type } = req.body;

    // Chama o serviço que orquestra a geração, persistência no banco e disparo do email.
    const result = await otpService.sendOTP(email, type);

    // Retorna HTTP 200 para sucesso, conforme o código enviado pelo utilizador.
    res.status(200).json({
        success:  'success',
        message: result.message,
    });

});

/**
 * Endpoint para verificar e consumir o código enviado pelo utilizador.
 * 
 */

exports.verifyOtp = catchAsync(async (req, res, next) => { 
    const { email, code}  = req.body;

    // Solicita a verificação ao serviço.
    await otpService.verifyOTP(email, code);

    // Se o serviço não lançar um AppError, significa que a validação foi bem-sucedida.
    res.status(200).json({
        success: 'success',
        message: 'Código verificado com sucesso.',
    });
});