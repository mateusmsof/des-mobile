const db = require('../../config/database');
const crypto = require('crypto');
const AppError = require('../../common/AppError');

exports.createVoucher = async ({ userId, customerId, storeId }) => {
  const voucherCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  const externalId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 dias

  const [rows] = await db.query(`
    INSERT INTO tb_vouchers (external_id, voucher_code, type, status, store_id, customer_id, expires_at)
    VALUES (?, ?, 'stamp', 'pending', ?, ?, ?)
  `, [externalId, voucherCode, storeId, customerId, expiresAt]);

  return {
    id: rows.insertId,
    externalId,
    voucherCode,
    type: 'stamp',
    status: 'pending',
    storeId: Number(storeId),
    customerId,
    expiresAt,
  };
};

exports.consumeVoucher = async ({ voucherCode, customerId }) => {
  // 1. Verificar se o voucher existe, está pendente e não expirou
  const [vouchers] = await db.query(`
    SELECT * FROM tb_vouchers 
    WHERE voucher_code = ? AND status = 'pending' AND expires_at > NOW()
  `, [voucherCode]);

  if (vouchers.length === 0) {
    throw new AppError('Voucher inválido, já utilizado ou expirado.', 400);
  }

  const voucher = vouchers[0];

  // 2. Buscar o cartão fidelidade ativo do cliente para a loja proprietária do voucher
  const [cards] = await db.query(`
    SELECT id FROM tb_loyalty_cards 
    WHERE customer_id = ? AND template_id IN (
      SELECT id FROM tb_loyalty_card_templates WHERE store_id = ?
    ) AND status = 'active'
    LIMIT 1
  `, [customerId, voucher.store_id]);

  if (cards.length === 0) {
    throw new AppError('Nenhum cartão fidelidade ativo encontrado para esta loja.', 404);
  }

  const loyaltyCardId = cards[0].id;
  const packExternalId = crypto.randomUUID();

  // Executa os inserts e updates usando uma conexão para consistência lógica
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 3. Atualizar o voucher para usado e associar ao cliente correspondente
    await connection.query(`
      UPDATE tb_vouchers 
      SET status = 'used', customer_id = ? 
      WHERE id = ?
    `, [customerId, voucher.id]);

    // 4. Inserir o novo pacote de selos fechado (sealed) vinculado ao cartão do cliente
    const [packResult] = await connection.query(`
      INSERT INTO tb_stamp_packs (external_id, loyalty_card_id, status)
      VALUES (?, ?, 'sealed')
    `, [packExternalId, loyaltyCardId]);

    await connection.commit();

    return {
      voucherId: voucher.id,
      voucherCode: voucher.voucher_code,
      status: 'used',
      pack: {
        id: packResult.insertId,
        externalId: packExternalId,
        loyaltyCardId,
        status: 'sealed'
      }
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
