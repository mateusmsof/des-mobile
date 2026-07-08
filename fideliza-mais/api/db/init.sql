CREATE DATABASE IF NOT EXISTS fideliza_mais CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fideliza_mais;

CREATE TABLE IF NOT EXISTS tb_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  external_id CHAR(36) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tb_otps (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_code (email, otp_code)
);

CREATE TABLE IF NOT EXISTS tb_stores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  external_id CHAR(36) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  trade_name VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES tb_users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tb_customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  external_id CHAR(36) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES tb_users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tb_rewards (
  id INT PRIMARY KEY AUTO_INCREMENT,
  external_id CHAR(36) NOT NULL UNIQUE,
  store_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  FOREIGN KEY (store_id) REFERENCES tb_stores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tb_loyalty_card_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  external_id CHAR(36) NOT NULL UNIQUE,
  store_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  max_stamps INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES tb_stores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tb_loyalty_card_template_rewards (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loyalty_card_template_id INT NOT NULL,
  reward_id INT NOT NULL,
  FOREIGN KEY (loyalty_card_template_id) REFERENCES tb_loyalty_card_templates(id) ON DELETE CASCADE,
  FOREIGN KEY (reward_id) REFERENCES tb_rewards(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tb_loyalty_cards (
  id INT PRIMARY KEY AUTO_INCREMENT,
  external_id CHAR(36) NOT NULL UNIQUE,
  customer_id INT NOT NULL,
  template_id INT NOT NULL,
  selected_reward_id INT DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  completed_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES tb_customers(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES tb_loyalty_card_templates(id) ON DELETE CASCADE,
  FOREIGN KEY (selected_reward_id) REFERENCES tb_rewards(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tb_loyalty_card_stamps (
  id INT PRIMARY KEY AUTO_INCREMENT,
  external_id CHAR(36) NOT NULL UNIQUE,
  loyalty_card_id INT NOT NULL,
  stamp_number INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loyalty_card_id) REFERENCES tb_loyalty_cards(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_card_stamp (loyalty_card_id, stamp_number)
);

CREATE TABLE IF NOT EXISTS tb_stamp_packs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  external_id CHAR(36) NOT NULL UNIQUE,
  loyalty_card_id INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'sealed',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loyalty_card_id) REFERENCES tb_loyalty_cards(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tb_modals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  external_id CHAR(36) NOT NULL UNIQUE,
  store_id INT DEFAULT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES tb_stores(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tb_vouchers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  external_id CHAR(36) NOT NULL UNIQUE,
  voucher_code CHAR(6) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  store_id INT NOT NULL,
  customer_id INT DEFAULT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES tb_stores(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES tb_customers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tb_voucher_stamps (
  voucher_id INT NOT NULL,
  stamp_count INT NOT NULL,
  PRIMARY KEY (voucher_id),
  FOREIGN KEY (voucher_id) REFERENCES tb_vouchers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tb_voucher_rewards (
  voucher_id INT NOT NULL,
  reward_id INT NOT NULL,
  loyalty_card_id INT NOT NULL,
  PRIMARY KEY (voucher_id, reward_id),
  FOREIGN KEY (voucher_id) REFERENCES tb_vouchers(id) ON DELETE CASCADE,
  FOREIGN KEY (reward_id) REFERENCES tb_rewards(id) ON DELETE CASCADE,
  FOREIGN KEY (loyalty_card_id) REFERENCES tb_loyalty_cards(id) ON DELETE CASCADE
);

-- seed demo
INSERT INTO tb_users (external_id, email) VALUES
  (UUID(), 'mateusmsof@gmail.com')
ON DUPLICATE KEY UPDATE email = email;

SET @user_id = (SELECT id FROM tb_users WHERE email = 'mateusmsof@gmail.com');

INSERT INTO tb_stores (external_id, user_id, trade_name) VALUES
  (UUID(), @user_id, 'Pausa & Sabor')
ON DUPLICATE KEY UPDATE trade_name = VALUES(trade_name);

SET @store_id = (SELECT id FROM tb_stores WHERE trade_name = 'Pausa & Sabor');

INSERT INTO tb_customers (external_id, user_id, display_name) VALUES
  (UUID(), @user_id, 'mateus')
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name);

SET @customer_id = (SELECT id FROM tb_customers WHERE user_id = @user_id);

INSERT INTO tb_loyalty_card_templates (external_id, store_id, title, max_stamps, status) VALUES
  (UUID(), @store_id, 'Combo Burguer Clássico', 10, 'published')
ON DUPLICATE KEY UPDATE title = VALUES(title), max_stamps = VALUES(max_stamps), status = VALUES(status);

SET @template_id = (SELECT id FROM tb_loyalty_card_templates WHERE store_id = @store_id LIMIT 1);

INSERT INTO tb_rewards (external_id, store_id, title, description) VALUES
  (UUID(), @store_id, '1 Cappuccino Gourmet', 'Resgate um cappuccino gourmet gratuito'),
  (UUID(), @store_id, '1 Bolo de Chocolate', 'Resgate um bolo de chocolate delicioso'),
  (UUID(), @store_id, '1 Croissant Artesanal', 'Resgate um croissant artesanal fresco')
ON DUPLICATE KEY UPDATE title = VALUES(title);

SET @reward1 = (SELECT id FROM tb_rewards WHERE store_id = @store_id AND title = '1 Cappuccino Gourmet');
SET @reward2 = (SELECT id FROM tb_rewards WHERE store_id = @store_id AND title = '1 Bolo de Chocolate');
SET @reward3 = (SELECT id FROM tb_rewards WHERE store_id = @store_id AND title = '1 Croissant Artesanal');

INSERT INTO tb_loyalty_card_template_rewards (loyalty_card_template_id, reward_id) VALUES
  (@template_id, @reward1),
  (@template_id, @reward2),
  (@template_id, @reward3)
ON DUPLICATE KEY UPDATE loyalty_card_template_id = loyalty_card_template_id;

INSERT INTO tb_loyalty_cards (external_id, customer_id, template_id, selected_reward_id, status) VALUES
  (UUID(), @customer_id, @template_id, @reward2, 'active')
ON DUPLICATE KEY UPDATE selected_reward_id = VALUES(selected_reward_id);

SET @card_id = (SELECT id FROM tb_loyalty_cards WHERE customer_id = @customer_id AND template_id = @template_id LIMIT 1);

INSERT INTO tb_loyalty_card_stamps (external_id, loyalty_card_id, stamp_number)
  SELECT UUID(), @card_id, 1 UNION ALL
  SELECT UUID(), @card_id, 2 UNION ALL
  SELECT UUID(), @card_id, 3;

INSERT INTO tb_stamp_packs (external_id, loyalty_card_id, status) VALUES
  (UUID(), @card_id, 'sealed'),
  (UUID(), @card_id, 'sealed');

INSERT INTO tb_modals (external_id, store_id, title, body, type, is_active) VALUES
  (UUID(), @store_id, 'Oferta de boas-vindas', 'Ganhe um selo extra no próximo pedido em Pausa & Sabor.', 'promo', TRUE)
ON DUPLICATE KEY UPDATE body = VALUES(body), is_active = VALUES(is_active);

INSERT INTO tb_vouchers (external_id, voucher_code, type, status, store_id, customer_id, expires_at) VALUES
  (UUID(), 'PAUSA1', 'stamp', 'pending', @store_id, @customer_id, DATE_ADD(NOW(), INTERVAL 30 DAY))
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO tb_otps (email, otp_code, is_used, expires_at) VALUES
  ('mateusmsof@gmail.com', '123456', FALSE, DATE_ADD(NOW(), INTERVAL 15 MINUTE));
