const db = require('../../config/database');

const fixEncoding = (val) => {
  if (val === null || val === undefined) return val;
  try {
    return Buffer.from(val, 'binary').toString('utf8');
  } catch (e) {
    return val;
  }
};

exports.listCardsByCustomer = async (customerId) => {
  const [rows] = await db.query(`
    SELECT
      lc.id AS card_id,
      lc.external_id AS card_external_id,
      lc.status AS card_status,
      lc.created_at AS created_at,
      DATE_ADD(lc.created_at, INTERVAL 365 DAY) AS expires_at,
      lc.selected_reward_id,
      tpl.id AS template_id,
      CONVERT(CONVERT(tpl.title USING latin1) USING utf8mb4) AS template_title,
      tpl.max_stamps AS max_stamps,
      str.id AS store_id,
      CONVERT(CONVERT(str.trade_name USING latin1) USING utf8mb4) AS store_name,
      COALESCE(CONVERT(CONVERT(rw.title USING latin1) USING utf8mb4), NULL) AS selected_reward_title,
      COUNT(st.id) AS filled_stamps
    FROM tb_loyalty_cards lc
    JOIN tb_loyalty_card_templates tpl ON tpl.id = lc.template_id
    JOIN tb_stores str ON str.id = tpl.store_id
    LEFT JOIN tb_rewards rw ON rw.id = lc.selected_reward_id
    LEFT JOIN tb_loyalty_card_stamps st ON st.loyalty_card_id = lc.id
    WHERE lc.customer_id = ?
    GROUP BY lc.id
    ORDER BY lc.created_at DESC
  `, [customerId]);

  return rows.map((row) => ({
    id: row.card_id,
    externalId: row.card_external_id,
    status: row.card_status,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    store: {
      id: row.store_id,
      name: fixEncoding(row.store_name),
    },
    title: fixEncoding(row.template_title),
    maxStamps: row.max_stamps,
    currentStamps: Number(row.filled_stamps),
    selectedReward: row.selected_reward_title ? {
      id: row.selected_reward_id,
      title: fixEncoding(row.selected_reward_title),
    } : null,
  }));
};

exports.getCardDetail = async (customerId, cardId) => {
  const [rows] = await db.query(`
    SELECT
      lc.id AS card_id,
      lc.external_id AS card_external_id,
      lc.status AS card_status,
      lc.created_at AS created_at,
      DATE_ADD(lc.created_at, INTERVAL 365 DAY) AS expires_at,
      lc.selected_reward_id,
      tpl.id AS template_id,
      tpl.title AS template_title,
      tpl.max_stamps AS max_stamps,
      str.id AS store_id,
      str.trade_name AS store_name,
      COALESCE(rw.title, NULL) AS selected_reward_title,
      COUNT(st.id) AS filled_stamps
    FROM tb_loyalty_cards lc
    JOIN tb_loyalty_card_templates tpl ON tpl.id = lc.template_id
    JOIN tb_stores str ON str.id = tpl.store_id
    LEFT JOIN tb_rewards rw ON rw.id = lc.selected_reward_id
    LEFT JOIN tb_loyalty_card_stamps st ON st.loyalty_card_id = lc.id
    WHERE lc.customer_id = ? AND lc.id = ?
    GROUP BY lc.id
    LIMIT 1
  `, [customerId, cardId]);

  if (!rows || rows.length === 0) {
    return null;
  }

  const row = rows[0];
  const [rewardRows] = await db.query(`
    SELECT r.id, r.title
    FROM tb_rewards r
    JOIN tb_loyalty_card_template_rewards ctr ON ctr.reward_id = r.id
    WHERE ctr.loyalty_card_template_id = ?
  `, [row.template_id]);

  return {
    id: row.card_id,
    externalId: row.card_external_id,
    status: row.card_status,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    store: {
      id: row.store_id,
      name: fixEncoding(row.store_name),
    },
    title: fixEncoding(row.template_title),
    maxStamps: row.max_stamps,
    currentStamps: Number(row.filled_stamps),
    selectedReward: row.selected_reward_title ? {
      id: row.selected_reward_id,
      title: fixEncoding(row.selected_reward_title),
    } : null,
    availableRewards: rewardRows.map((reward) => ({
      id: reward.id,
      title: fixEncoding(reward.title && String(reward.title)),
    })),
  };
};
