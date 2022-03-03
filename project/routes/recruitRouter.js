// 스터디 모집 관련 라우터
const express = require('express');
const recruitController = require('../controllers/recruitController');
const router = express.Router();

// 스터디모집글 목록 조회
router.get('/', recruitController.getList);
// 스터디모집글 상세 조회
router.get('/detail/:sgId', recruitController.getDetail);
// 스터디 / 스터디 모집글 생성
router.post('/', recruitController.createStudy);
// 스터디 / 스터디 모집글 수정
router.put('/', recruitController.modifyStudy);
// 스터디 모집완료
router.put('/complete/:sgId', recruitController.modifyComplete);

// 스터디모집글 댓글 조회
router.get('/comment/:sgId', recruitController.getComment);
// 스터디모집글 댓글 등록
router.post('/comment', recruitController.createComment);
// 스터디모집글 댓글 수정
router.put('/comment', recruitController.modifyComment);
// 스터디모집글 댓글 삭제
router.delete('/comment/:srcId', recruitController.removeComment);

// 공통코드 조회
router.get('/comCd/:cgcName', recruitController.getComCd);

module.exports = router;