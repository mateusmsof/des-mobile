const catchAsync = require('../../common/catchAsync');
const otpService = require('../otp/otp.service');
const authService = require('./auth.service');
const AppError = require('../../common/AppError');

exports.sendOtp = catchAsync(async (req, res) => {
	const { email, type } = req.body;

	if (!email || typeof email !== 'string') {
		throw new AppError('E-mail é obrigatório.', 400);
	}

	const result = await otpService.sendOTP(email, type);
	res.status(200).json({ success: 'success', message: result.message });
});

exports.verifyOtp = catchAsync(async (req, res) => {
	const { email, code } = req.body;

	if (!email || !code) {
		throw new AppError('E-mail e código OTP são obrigatórios.', 400);
	}

	await otpService.verifyOTP(email, code);

	const user = await authService.findOrCreateUser(email.trim().toLowerCase());
	const customer = await authService.findOrCreateCustomer({ userId: user.id, email: user.email });
	const token = await authService.issueTokenForUser(user, customer);

	res.status(200).json({
		success: 'success',
		message: 'Login realizado com sucesso.',
		token,
		user: {
			id: user.id,
			email: user.email,
		},
		customer: {
			id: customer.id,
			displayName: customer.display_name || customer.displayName,
		},
	});
});
