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

    res.render('detail', {
        sgId: sgId,
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