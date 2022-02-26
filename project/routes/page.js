const express = require('express');
const db = require('../lib/db');
const router = express.Router();

/**
 * 메인 페이지
 */
router.get('/', (req, res) => {
    res.render('main');
});

/**
 * 스터디 상세 페이지
 */
router.get('/detail/:sgId', (req, res) => {
    const sgId = req.params.sgId;

    db.query(`
        SELECT B.SR_ID 
          FROM STUDY_GROUP AS A
          LEFT JOIN STUDY_RCRTM AS B 
            ON A.SG_ID = B.SG_ID AND B.SR_DEL_YN = 'N'
         WHERE A.SG_ID = ?
           AND A.SG_DEL_YN = 'N'
    `, [sgId], (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }

        res.render('detail', {
            sgId: sgId,
            srId: result[0].SR_ID
        });
    });

    
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