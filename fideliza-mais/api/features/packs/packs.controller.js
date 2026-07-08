const catchAsync = require('../../common/catchAsync');
const packsService = require('./packs.service');
const AppError = require('../../common/AppError');

exports.listMyPacks = catchAsync(async (req, res) => {
  const customerId = req.user.customerId;

  if (!customerId) {
    throw new AppError('Cliente não encontrado no token.', 401);
  }

  const packs = await packsService.listPacksByCustomer(customerId);
  res.status(200).json({ success: 'success', data: packs });
});

exports.getPackDetail = catchAsync(async (req, res) => {
  const customerId = req.user.customerId;
  const packId = req.params.id;

  if (!customerId) {
    throw new AppError('Cliente não encontrado no token.', 401);
  }

  const pack = await packsService.getPackDetail(customerId, packId);
  if (!pack) {
    throw new AppError('Pacote não encontrado.', 404);
  }

  res.status(200).json({ success: 'success', data: pack });
});

exports.openPack = catchAsync(async (req, res) => {
  const customerId = req.user.customerId;
  const packId = req.params.id;

  if (!customerId) {
    throw new AppError('Cliente não encontrado no token.', 401);
  }

  const result = await packsService.openPack(customerId, packId);
  res.status(200).json({ success: 'success', data: result });
});
