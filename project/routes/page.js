const express = require('express');
const axios = require('axios');
const pool = require('../lib/db');
const recruitService = require('../services/recruitService');
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
            stName: stName.data,
            mode: 'create'
        });   
    } catch (err) {
        console.error(err);
    }
});

/**
 * 스터디 수정 페이지
 */
router.get('/update/:sgId', async (req, res) => {
    // [TODO] 생성페이지에서 사용하는 로직, 수정페이지에서 사용하는 로직 같은부분 따로 빼서 관리하는게 좋을듯? 일단 axios -> service 데이터 가져오는것으로 수정한 후
    // [TODO] api 주소 환경에 따라 사용할 수 있게 변수로 변경해야함
    const userId = 1; // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const sgId = req.params.sgId;

    try {
        const sgCategory = await axios.get('http://localhost:8001/recruit/comCd/sg_category');  // 공통코드 조회 - 카테고리
        const stName = await axios.get('http://localhost:8001/recruit/comCd/st_name');          // 공통코드 조회 - 기술스택
        const recruitDetail = await recruitService.getDetail(userId, sgId);

        recruitDetail[0].ST_NAME = recruitDetail[0].ST_NAME.split(',');
        
        res.render('create', {
            sgCategory: sgCategory.data,
            stName: stName.data,
            recruitDetail: recruitDetail[0],
            mode: 'modify'
        });   
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;