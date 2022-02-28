const express = require('express');
const axios = require('axios');
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
        sgId
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
router.get('/create', async (req, res) => {
    // [TODO] api 주소 환경에 따라 사용할 수 있게 변수로 변경해야함
    try {
        const sgCategory = await axios.get('http://localhost:8001/recruit/comCd/sg_category');  // 공통코드 조회 - 카테고리
        const stName = await axios.get('http://localhost:8001/recruit/comCd/st_name');          // 공통코드 조회 - 기술스택
        
        res.render('create', {
            sgCategory: sgCategory.data,
            stName: stName.data
        });   
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;