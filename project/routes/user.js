const express = require('express');
const db = require('../lib/db');

const router = express.Router();

router.get('/test', (req, res) => {
    db.query(`SELECT * FROM USER`, (err, result) => {
        console.log(result);
        res.end();
    });
});

module.exports = router;