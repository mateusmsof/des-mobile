const db = require('../../config/database');
const crypto = require('crypto');

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
