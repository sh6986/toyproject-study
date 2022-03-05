const express = require('express');
const manageController = require('../controllers/manageController');
const {isLoggedIn} = require('./middlewares');
const router = express.Router();

// 게시판 목록 조회
router.get('/boardList/:sgId', manageController.getBoardList);
// 게시판 상세 조회
router.get('/boardDetail/:sbId', manageController.getBoardDetail);
// 게시판 글 생성
router.post('/board', isLoggedIn, manageController.createBoard);
// 게시판 글 수정
router.put('/board', isLoggedIn, manageController.modifyBoard);
// 게시판 글 삭제
router.delete('/board/:sbId', isLoggedIn, manageController.removeBoard);


/**
 * 일정
 */


module.exports = router;