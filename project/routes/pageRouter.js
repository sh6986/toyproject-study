const express = require('express');
const recruitService = require('../services/recruitService');
const router = express.Router();

/**
 * 스터디 목록 페이지 - 메인 페이지
 */
router.get('/', (req, res) => {
    res.render('main');
});

/**
 * 스터디 상세 페이지
 */
router.get('/detail/:sgId', (req, res) => {
    const sgId = req.params.sgId;

    res.render('recruit/detail', {
        sgId
    });
});

/**
 * 스터디 생성 페이지
 */
router.get('/create', async (req, res) => {
    try {
        const sgCategory = await recruitService.getComCd('sg_category');    // 공통코드 조회 - 카테고리
        const stName = await recruitService.getComCd('st_name');            // 공통코드 조회 - 기술스택

        res.render('recruit/create', {
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
        
        res.render('recruit/create', {
            sgCategory,
            stName,
            recruitDetail: recruitDetail[0],
            mode: 'modify'
        });   
    } catch (err) {
        console.error(err);
    }
});

/**
 * 로그인 페이지
 */
 router.get('/login', (req, res) => {
    res.render('user/login', {page: 'login'});
});

router.get('/myStudy', (req, res) => {
    res.render('user/myStudy');
});

router.get('/bookmark', (req, res) => {
    res.render('user/bookmark');
});

router.get('/dashboard', (req, res) => {
    res.render('manage/dashboard');
});

router.get('/board', (req, res) => {
    res.render('manage/board');
});

module.exports = router;