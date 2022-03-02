const express = require('express');
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
    try {
        const sgCategory = await recruitService.getComCd('sg_category');    // 공통코드 조회 - 카테고리
        const stName = await recruitService.getComCd('st_name');            // 공통코드 조회 - 기술스택

        res.render('create', {
            sgCategory,
            stName,
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
    const userId = 1; // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const sgId = req.params.sgId;

    try {
        const sgCategory = await recruitService.getComCd('sg_category');    // 공통코드 조회 - 카테고리
        const stName = await recruitService.getComCd('st_name');            // 공통코드 조회 - 기술스택
        const recruitDetail = await recruitService.getDetail(userId, sgId);

        recruitDetail[0].ST_NAME = recruitDetail[0].ST_NAME.split(',');
        
        res.render('create', {
            sgCategory,
            stName,
            recruitDetail: recruitDetail[0],
            mode: 'modify'
        });   
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;