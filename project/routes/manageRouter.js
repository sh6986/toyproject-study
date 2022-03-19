const express = require('express');
const manageController = require('../controllers/manageController');
const {isLoggedIn} = require('./middlewares');
const router = express.Router();

// 스터디 상세 조회
router.get('/detail/:sgId', manageController.getDetail);
// 스터디 멤버 삭제
router.delete('/member/:sgId', isLoggedIn, manageController.removeStudyMember);
// 스터디 삭제 (폐쇄)
router.delete('/study/:sgId', isLoggedIn, manageController.removeStudy);

// 스터디 규칙 등록 / 수정
router.put('/studyRule', isLoggedIn, manageController.modifyStudyRule);

// 일정 목록 조회
router.get('/scheduleList/:sgId', isLoggedIn, manageController.getScheduleList);
// 일정 상세 조회
router.get('/schedule/:ssId', isLoggedIn, manageController.getScheduleDetail);
// 일정 등록
router.post('/schedule', isLoggedIn, manageController.createSchedule);
// 일정 수정
router.put('/schedule', isLoggedIn, manageController.modifySchedule);
// 일정 삭제
router.delete('/schedule/:ssId', isLoggedIn, manageController.removeSchedule);

// 팀원 목록 조회
router.get('/getMemberList/:sgId', isLoggedIn, manageController.getMemberList);
// 일정 출결 상세 조회
router.get('/scheduleAtndn/:ssId', isLoggedIn, manageController.getScheduleAtndn);
// 일정 출결 투표 등록
router.post('/scheduleAtndn', isLoggedIn, manageController.createScheduleAtndn);
// 일정 출결 투표 수정
router.put('/scheduleAtndn', isLoggedIn, manageController.modifyScheduleAtndn);

// 대시보드 게시판 목록 조회
router.get('/dashBoard/boardList/:sgId', isLoggedIn, manageController.getDashBordBoardList);
// 게시판 목록 조회
router.get('/boardList/:sgId', isLoggedIn, manageController.getBoardList);
// 게시판 상세 조회
router.get('/boardDetail/:sbId', isLoggedIn, manageController.getBoardDetail);
// 게시판 글 생성
router.post('/board', isLoggedIn, manageController.createBoard);
// 게시판 글 수정
router.put('/board', isLoggedIn, manageController.modifyBoard);
// 게시판 글 삭제
router.delete('/board/:sbId', isLoggedIn, manageController.removeBoard);

// 권한 수정
router.put('/memberAuth', isLoggedIn, manageController.modifyModifyAuth);

module.exports = router;