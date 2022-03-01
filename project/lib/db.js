const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'asd97979',
    database: 'study',
    connectionLimit: 10
});

module.exports = pool;