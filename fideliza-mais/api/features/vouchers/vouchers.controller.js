const catchAsync = require('../../common/catchAsync');
const vouchersService = require('./vouchers.service');
const AppError = require('../../common/AppError');

exports.createVoucher = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const customerId = req.user.customerId;
  const storeId = req.params.storeId;

  const voucher = await vouchersService.createVoucher({ userId, customerId, storeId });
  res.status(201).json({ success: 'success', data: voucher });
});
