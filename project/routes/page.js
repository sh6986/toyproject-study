const express = require('express');
const db = require('../lib/db');
const router = express.Router();

/**
 * 메인 페이지
 */
router.get('/', (req, res) => {
    db.query(`
        SELECT * 
          FROM STUDY_GROUP AS A
          LEFT JOIN STUDY_RCRTM AS B
            ON A.SG_ID = B.SG_ID
    `, (err, result) => {
        console.log(result);
        res.render('main', {
            sr_title: result[0].sr_title
        });
    });

    // res.render('main');
});

/**
 * 로그인 페이지
 */
router.get('/login', (req, res) => {
    res.render('login', {page: 'login'});
});

/**
 * 스터디 생성 페이지
 */
router.get('/create', (req, res) => {
    res.render('create');
});

module.exports = router;