const db = require('../../config/database');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../../common/AppError');

const generateToken = ({ userId, customerId, displayName, email }) => {
	const payload = {
		userId,
		customerId,
		displayName,
		email,
	};

	return jwt.sign(payload, process.env.JWT_SECRET || 'fideliza_mais_secret', {
		expiresIn: '30d',
	});
};

exports.findOrCreateUser = async (email) => {
	const [users] = await db.query('SELECT id, email FROM tb_users WHERE email = ?', [email]);
	if (users.length > 0) {
		return users[0];
	}

	const externalId = crypto.randomUUID();
	const [result] = await db.query('INSERT INTO tb_users (external_id, email) VALUES (?, ?)', [externalId, email]);

	return {
		id: result.insertId,
		email,
	};
};

exports.findOrCreateCustomer = async ({ userId, email }) => {
	const [customers] = await db.query('SELECT id, external_id, display_name FROM tb_customers WHERE user_id = ?', [userId]);
	if (customers.length > 0) {
		return customers[0];
	}

	const externalId = crypto.randomUUID();
	const displayName = email.split('@')[0];
	const [result] = await db.query(
		'INSERT INTO tb_customers (external_id, user_id, display_name) VALUES (?, ?, ?)',
		[externalId, userId, displayName]
	);

	return {
		id: result.insertId,
		externalId,
		displayName,
	};
};

exports.issueTokenForUser = async (user, customer) => {
	return generateToken({
		userId: user.id,
		customerId: customer.id,
		displayName: customer.display_name || customer.displayName,
		email: user.email,
	});
};