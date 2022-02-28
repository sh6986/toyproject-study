const mysql = require('mysql2/promise');
const db = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'asd97979',
    database: 'study',
    connectionLimit: 10
});

module.exports = db;