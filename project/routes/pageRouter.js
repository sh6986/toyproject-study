const express = require('express');
const recruitService = require('../services/recruitService');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const router = express.Router();

/**
 * 세션에 저장된 유저 정보 가져오기
 */
router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

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
    res.render('recruit/detail', {sgId});
});

/**
 * 스터디 생성 페이지
 */
router.get('/create', isLoggedIn, async (req, res) => {
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
        next(err);
    }
});

/**
 * 스터디 수정 페이지
 */
router.get('/update/:sgId', isLoggedIn, async (req, res) => {
    const sgId = req.params.sgId;

    try {
        const sgCategory = await recruitService.getComCd('sg_category');    // 공통코드 조회 - 카테고리
        const stName = await recruitService.getComCd('st_name');            // 공통코드 조회 - 기술스택
        const recruitDetail = await recruitService.getDetail(sgId);

        recruitDetail[0].ST_NAME = recruitDetail[0].ST_NAME.split(',');
        
        res.render('recruit/create', {
            sgCategory,
            stName,
            recruitDetail: recruitDetail[0],
            mode: 'modify'
        });   
    } catch (err) {
        console.error(err);
        next(err);
    }
});

/**
 * 로그인 페이지
 */
 router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('user/login', {page: 'login'});
});

/**
 * 내 스터디 목록 페이지
 */
router.get('/myStudy', isLoggedIn, (req, res) => {
    res.render('user/myStudy');
});

/**
 * 내 북마크 목록 페이지
 */
router.get('/bookmark', isLoggedIn, (req, res) => {
    res.render('user/bookmark');
});

/**
 * 스터디관리 - 대시보드 페이지
 */
router.get('/dashboard/:sgId', isLoggedIn, (req, res) => {
    const sgId = req.params.sgId;
    res.render('manage/dashboard', {sgId});
});

/**
 * 스터디관리 - 게시판 목록 페이지
 */
 router.get('/boardList/:sgId', isLoggedIn, (req, res) => {
    const sgId = req.params.sgId;
    res.render('manage/boardList', {sgId});
});

/**
 * 스터디관리 - 게시판 글 상세 페이지
 */
 router.get('/board/detail/:sgId/:sbId', isLoggedIn, (req, res) => {
    const sgId = req.params.sgId;
    const sbId = req.params.sbId;

    res.render('manage/boardDetail', {sgId, sbId});
});

/**
 * 스터디관리 - 게시판 글등록
 */
router.get('/board/create/:sgId', isLoggedIn, (req, res) => {
    const sgId = req.params.sgId;

    res.render('manage/boardCreate', {
        mode: 'create',
        sgId
    });
});

/**
 * 스터디관리 - 게시판 글수정
 */
router.get('/board/modify/:sgId/:sbId', isLoggedIn, (req, res) => {
    const sgId = req.params.sgId;
    const sbId = req.params.sbId;

    res.render('manage/boardCreate', {
        mode: 'modify',
        sgId,
        sbId
    });
});

/**
 * 스터디관리 - 일정 등록
 */
router.get('/schedule/create/:sgId', isLoggedIn, (req, res) => {
    const sgId = req.params.sgId;
    
    res.render('manage/scheduleCreate', {
        mode: 'create',
        sgId
    });
});

module.exports = router;