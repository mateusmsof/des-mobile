const express = require('express');
const authController = require('./features/auth/auth.controller');
const otpController = require('./features/otp/otp.controller');
const cardsController = require('./features/cards/cards.controller');
const packsController = require('./features/packs/packs.controller');
const vouchersController = require('./features/vouchers/vouchers.controller');
const modalsController = require('./features/modals/modals.controller');
const authMiddleware = require('./middleware/auth');

const router = express.Router();

router.post('/auth/otp', authController.sendOtp);
router.post('/auth/verify', authController.verifyOtp);

router.get('/me/cards', authMiddleware, cardsController.listMyCards);
router.get('/cards/:id', authMiddleware, cardsController.getCardDetail);

router.get('/me/packs', authMiddleware, packsController.listMyPacks);
router.get('/packs/:id', authMiddleware, packsController.getPackDetail);
router.post('/packs/:id/open', authMiddleware, packsController.openPack);

// Rota de emissão: pública (Sem autenticação)
router.post('/stores/:storeId/vouchers', vouchersController.createVoucher);

// Nova Rota de consumo: privada (Requer autenticação do cliente)
router.post('/vouchers/consume', authMiddleware, vouchersController.consumeVoucher);

router.post('/modals', authMiddleware, modalsController.createModal);
router.get('/modals/active', modalsController.listActiveModals);

module.exports = router;
