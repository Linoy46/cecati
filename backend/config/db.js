const mysql = require('mysql2/promise'); // Usa la versión con soporte para Promises
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(() => console.log('✅ Conectado a la base de datos MySQL'))
    .catch(err => console.error('❌ Error conectando a la base de datos:', err));

module.exports = pool;
