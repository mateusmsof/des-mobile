const db = require('../../config/database');
const crypto = require('crypto');

exports.createModal = async ({ title, body, type, storeId, isActive }) => {
  const externalId = crypto.randomUUID();

  const [rows] = await db.query(`
    INSERT INTO tb_modals (external_id, store_id, title, body, type, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [externalId, storeId || null, title, body, type, isActive ? 1 : 0]);

  return {
    id: rows.insertId,
    externalId,
    storeId: storeId || null,
    title,
    body,
    type,
    isActive,
  };
};

exports.listActiveModals = async () => {
  const [rows] = await db.query(`
    SELECT id, external_id AS externalId, store_id AS storeId, title, body, type, is_active AS isActive, created_at AS createdAt
    FROM tb_modals
    WHERE is_active = 1
    ORDER BY created_at DESC
  `);

  return rows.map((row) => ({
    ...row,
    isActive: Boolean(row.isActive),
  }));
};
