// 스터디 모집 관련 라우터
const express = require('express');
const recruitController = require('../controllers/recruitController');
const {isLoggedIn} = require('./middlewares');
const router = express.Router();

// 스터디모집글 목록 조회
router.get('/', recruitController.getList);
// 스터디모집글 상세 조회
router.get('/detail/:sgId', recruitController.getDetail);
// 스터디 / 스터디 모집글 생성
router.post('/', isLoggedIn, recruitController.createStudy);
// 스터디 / 스터디 모집글 수정
router.put('/', isLoggedIn, recruitController.modifyStudy);
// 스터디 모집완료
router.put('/complete/:sgId', isLoggedIn, recruitController.modifyComplete);
// 스터디 모집열기
router.put('/open/:sgId', isLoggedIn, recruitController.modifyOpen);
// 스터디 멤버 생성
router.post('/member', isLoggedIn, recruitController.createMember);
// 스터디 북마크 등록
router.post('/studyBkm', isLoggedIn, recruitController.createStudyBkm);
// 스터디 북마크 취소
router.put('/studyBkm', isLoggedIn, recruitController.modifyStudyBkm);

// 스터디모집글 댓글 조회
router.get('/comment/:sgId', recruitController.getComment);
// 스터디모집글 댓글 등록
router.post('/comment', isLoggedIn, recruitController.createComment);
// 스터디모집글 댓글 수정
router.put('/comment', isLoggedIn, recruitController.modifyComment);
// 스터디모집글 댓글 삭제
router.delete('/comment/:srcId', isLoggedIn, recruitController.removeComment);

// 공통코드 조회
router.get('/comCd/:cgcName', recruitController.getComCd);

module.exports = router;