const catchAsync = require('../../common/catchAsync');
const vouchersService = require('./vouchers.service');
const AppError = require('../../common/AppError');

exports.createVoucher = catchAsync(async (req, res) => {
  const userId = null;
  const customerId = null;
  const storeId = req.params.storeId;

  const voucher = await vouchersService.createVoucher({ userId, customerId, storeId });
  res.status(201).json({ success: 'success', data: voucher });
});

exports.consumeVoucher = catchAsync(async (req, res) => {
  // Dados do cliente obtidos via authMiddleware
  const customerId = req.user.customerId; 
  const { voucherCode } = req.body;

  if (!voucherCode) {
    throw new AppError('O código do voucher é obrigatório.', 400);
  }

  const result = await vouchersService.consumeVoucher({ voucherCode, customerId });
  
  res.status(200).json({ 
    success: 'success', 
    message: 'Voucher consumido e pacote de selos gerado com sucesso.',
    data: result 
  });
});
