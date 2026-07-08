const catchAsync = require('../../common/catchAsync');
const modalsService = require('./modals.service');
const AppError = require('../../common/AppError');

exports.createModal = catchAsync(async (req, res) => {
  const { title, body, type, storeId, isActive } = req.body;

  if (!title || !body || !type) {
    throw new AppError('Título, corpo e tipo são obrigatórios.', 400);
  }

  const modal = await modalsService.createModal({ title, body, type, storeId, isActive: isActive !== false });
  res.status(201).json({ success: 'success', data: modal });
});

exports.listActiveModals = catchAsync(async (_req, res) => {
  const modals = await modalsService.listActiveModals();
  res.status(200).json({ success: 'success', data: modals });
});
