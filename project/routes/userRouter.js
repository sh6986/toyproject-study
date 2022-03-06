const express = require('express');
const userController = require('../controllers/userController');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

// 내 스터디 목록 조회
router.get('/myStudy', isLoggedIn, userController.getMyStudyList);
// 내 북마크 목록 조회
router.get('/studyBkm', isLoggedIn, userController.getStudyBkmList);

module.exports = router;