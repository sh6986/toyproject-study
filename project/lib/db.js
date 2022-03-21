const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD,
    // database: 'study',
    database: 'study_dev',
    connectionLimit: 10
});

module.exports = pool;