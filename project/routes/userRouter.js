const express = require('express');
const pool = require('../lib/db');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 * 내 스터디 목록 조회
 */
router.get('/myStudy', userController.getMyStudyList);

module.exports = router;