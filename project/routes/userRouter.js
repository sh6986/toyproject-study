const express = require('express');
const userController = require('../controllers/userController');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

// 내 스터디 목록 조회
router.get('/myStudy', isLoggedIn, userController.getMyStudyList);
// 내 북마크 목록 조회
router.get('/studyBkm', isLoggedIn, userController.getStudyBkmList);

// 닉네임 수정
router.put('/nickName', isLoggedIn, userController.modifyNickname);
// 회원 탈퇴
router.delete('/', isLoggedIn, userController.modifyScsn);

module.exports = router;