const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mysql = require('mysql2/promise');

// Cria a conexão
const dbconn = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB || 'fideliza_mais',
    multipleStatements: true
});

/**
 * Teste silencioso de conexão
 */
const initDb = async () => {
    try {
        await dbconn.query('SELECT 1');
        console.log('Pool de conexões pronto e banco acessível!');
    } catch (err) {
        console.error('Erro ao acessar o banco via Pool:', err.message);
    }
};

initDb();

module.exports = dbconn;