const db = require('../../config/database');
const crypto = require('crypto');
const AppError = require('../../common/AppError');

exports.listPacksByCustomer = async (customerId) => {
  const [rows] = await db.query(`
    SELECT
      p.id AS pack_id,
      p.external_id AS pack_external_id,
      p.status AS pack_status,
      p.created_at AS created_at,
      lc.id AS card_id,
      tpl.store_id AS store_id,
      str.trade_name AS store_name
    FROM tb_stamp_packs p
    JOIN tb_loyalty_cards lc ON lc.id = p.loyalty_card_id
    JOIN tb_loyalty_card_templates tpl ON tpl.id = lc.template_id
    JOIN tb_stores str ON str.id = tpl.store_id
    WHERE lc.customer_id = ?
      AND p.status = 'sealed'
    ORDER BY p.created_at DESC
  `, [customerId]);

  const grouped = rows.reduce((acc, pack) => {
    const key = String(pack.store_id);
    if (!acc[key]) {
      acc[key] = {
        storeId: pack.store_id,
        storeName: pack.store_name,
        count: 0,
        packs: [],
      };
    }
    acc[key].count += 1;
    acc[key].packs.push({
      id: pack.pack_id,
      externalId: pack.pack_external_id,
      status: pack.pack_status,
      createdAt: pack.created_at,
      cardId: pack.card_id,
    });
    return acc;
  }, {});

  return Object.values(grouped);
};

exports.getPackDetail = async (customerId, packId) => {
  const [rows] = await db.query(`
    SELECT
      p.id AS pack_id,
      p.external_id AS pack_external_id,
      p.status AS pack_status,
      p.created_at AS created_at,
      lc.id AS card_id,
      lc.external_id AS card_external_id,
      tpl.title AS template_title,
      tpl.max_stamps,
      str.id AS store_id,
      str.trade_name AS store_name
    FROM tb_stamp_packs p
    JOIN tb_loyalty_cards lc ON lc.id = p.loyalty_card_id
    JOIN tb_loyalty_card_templates tpl ON tpl.id = lc.template_id
    JOIN tb_stores str ON str.id = tpl.store_id
    WHERE p.id = ? AND lc.customer_id = ?
    LIMIT 1
  `, [packId, customerId]);

  if (!rows || rows.length === 0) {
    return null;
  }

  const row = rows[0];
  const [stampCountRows] = await db.query(`
    SELECT COUNT(*) AS filled_stamps
    FROM tb_loyalty_card_stamps
    WHERE loyalty_card_id = ?
  `, [row.card_id]);

  return {
    id: row.pack_id,
    externalId: row.pack_external_id,
    status: row.pack_status,
    createdAt: row.created_at,
    store: {
      id: row.store_id,
      name: row.store_name,
    },
    card: {
      id: row.card_id,
      externalId: row.card_external_id,
      title: row.template_title,
      maxStamps: row.max_stamps,
      currentStamps: Number(stampCountRows[0]?.filled_stamps || 0),
    },
  };
};

exports.openPack = async (customerId, packId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [packRows] = await connection.query(`
      SELECT
        p.id AS pack_id,
        p.status AS pack_status,
        lc.id AS card_id,
        tpl.max_stamps
      FROM tb_stamp_packs p
      JOIN tb_loyalty_cards lc ON lc.id = p.loyalty_card_id
      JOIN tb_loyalty_card_templates tpl ON tpl.id = lc.template_id
      WHERE p.id = ? AND lc.customer_id = ?
      FOR UPDATE
    `, [packId, customerId]);

    if (!packRows || packRows.length === 0) {
      throw new AppError('Pacote não encontrado.', 404);
    }

    const pack = packRows[0];
    if (pack.pack_status !== 'sealed') {
      throw new AppError('Pacote já foi aberto.', 400);
    }

    const [stampCountRows] = await connection.query(`
      SELECT COUNT(*) AS filled_stamps
      FROM tb_loyalty_card_stamps
      WHERE loyalty_card_id = ?
    `, [pack.card_id]);

    const filledStamps = Number(stampCountRows[0]?.filled_stamps || 0);
    if (filledStamps >= pack.max_stamps) {
      throw new AppError('O cartão já atingiu o número máximo de selos.', 400);
    }

    const nextStampNumber = filledStamps + 1;
    await connection.query(`
      INSERT INTO tb_loyalty_card_stamps (external_id, loyalty_card_id, stamp_number)
      VALUES (?, ?, ?)
    `, [crypto.randomUUID(), pack.card_id, nextStampNumber]);

    await connection.query(`
      UPDATE tb_stamp_packs SET status = 'opened' WHERE id = ?
    `, [packId]);

    await connection.commit();

    return {
      packId: pack.pack_id,
      cardId: pack.card_id,
      nextStampNumber,
      maxStamps: pack.max_stamps,
      status: 'opened',
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
