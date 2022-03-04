const express = require('express');
const manageController = require('../controllers/manageController');
const router = express.Router();

// 게시판 목록 조회
router.get('/boardList/:sgId', manageController.getBoardList);
// 게시판 상세 조회
router.get('/boardDetail/:sbId', manageController.getBoardDetail);
// 게시판 글 생성
router.post('/board', manageController.createBoard);
// 게시판 글 수정
router.put('/board', manageController.modifyBoard);
// 게시판 글 삭제
router.delete('/board/:sbId', manageController.removeBoard);


/**
 * 일정
 */


module.exports = router;