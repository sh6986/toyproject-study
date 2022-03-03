const express = require('express');
const manageController = require('../controllers/manageController');
const router = express.Router();

// 게시판 목록 조회
router.get('/boardList/:sgId', manageController.getBoardList);



/**
 * 일정
 */


module.exports = router;