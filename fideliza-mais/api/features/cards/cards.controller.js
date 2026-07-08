const catchAsync = require('../../common/catchAsync');
const cardsService = require('./cards.service');
const AppError = require('../../common/AppError');

exports.listMyCards = catchAsync(async (req, res) => {
  const customerId = req.user.customerId;
  if (!customerId) {
    throw new AppError('Cliente não encontrado no token.', 401);
  }

  const cards = await cardsService.listCardsByCustomer(customerId);
  res.status(200).json({ success: 'success', data: cards });
});

exports.getCardDetail = catchAsync(async (req, res) => {
  const customerId = req.user.customerId;
  const cardId = req.params.id;

  if (!customerId) {
    throw new AppError('Cliente não encontrado no token.', 401);
  }

  const card = await cardsService.getCardDetail(customerId, cardId);

  if (!card) {
    throw new AppError('Cartão não encontrado.', 404);
  }

  res.status(200).json({ success: 'success', data: card });
});
