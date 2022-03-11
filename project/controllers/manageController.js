const manageService = require('../services/manageService');

/**
 * 스터디 멤버 삭제
 */
exports.removeStudyMember = async (req, res, next) => {
    const sgId = req.params.sgId;
    const userId = req.user.USER_ID;

    try {
        await manageService.removeStudyMember(sgId, userId);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 스터디 규칙 등록 / 수정
 */
exports.modifyStudyRule = async (req, res, next) => {
    const study = req.body;
    study.userId = req.user.USER_ID;

    try {
        await manageService.modifyStudyRule(study);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 일정 목록 조회
 */
exports.getScheduleList = async (req, res, next) => {
    const sgId = req.params.sgId;

    try {
        const result = await manageService.getScheduleList(sgId);
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 일정 상세 조회
 */
exports.getScheduleDetail = async (req, res, next) => {
    const ssId = req.params.ssId;

    try { 
        const result = await manageService.getScheduleDetail(ssId);
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 일정 등록
 */
exports.createSchedule = async (req, res, next) => {
    const schedule = req.body;
    schedule.userId = req.user.USER_ID;

    try {
        const ssId = await manageService.createSchedule(schedule);
        res.json({ssId});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 일정 수정
 */
exports.modifySchedule = async (req, res, next) => {
    const schedule = req.body;
    schedule.userId = req.user.USER_ID;

    try {
        await manageService.modifySchedule(schedule);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 일정 삭제
 */
exports.removeSchedule = async (req, res, next) => {
    const userId = req.user.USER_ID;
    const ssId = req.params.ssId;

    try {
        await manageService.removeSchedule(userId, ssId);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 일정 출결 목록 조회
 */
exports.getScheduleAtndnList = async (req, res, next) => {
    const sgId = req.params.sgId;

    try {
        const result = await manageService.getScheduleAtndnList(sgId);
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 일정 출결 상세 조회
 */
exports.getScheduleAtndn = async (req, res, next) => {
    const ssId = req.params.ssId;

    try {
        const result = await manageService.getScheduleAtndn(ssId);
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 일정 출결 투표 등록
 */
exports.createScheduleAtndn = async (req, res, next) => {
    const scheduleAtndn = req.body;
    scheduleAtndn.userId = req.user.USER_ID;

    try {
        await manageService.createScheduleAtndn(scheduleAtndn);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 일정 출결 투표 수정
 */
exports.modifyScheduleAtndn = async (req, res, next) => {
    const scheduleAtndn = req.body;
    scheduleAtndn.userId = req.user.USER_ID;

    try {
        await manageService.modifyScheduleAtndn(scheduleAtndn);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 게시판 목록 조회
 */
exports.getBoardList = async (req, res, next) => {
    const sgId = req.params.sgId;
    
    try {
        const result = await manageService.getBoardList(sgId);
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 게시판 상세 조회
 */
exports.getBoardDetail = async (req, res, next) => {
    const sbId = req.params.sbId;

    try {
        // 조회수 증가
        await manageService.modifyBoardViews(sbId);
        // 상세조회
        const result = await manageService.getBoardDetail(sbId);
        res.json(result[0]);
    } catch (err) {
        console.error(err)
        next(err);
    }
};

/**
 * 게시판 글 생성
 */
exports.createBoard = async (req, res, next) => {
    const board = req.body;
    board.userId = req.user.USER_ID;

    try {
        const sbId = await manageService.createBoard(board);
        res.json({sbId});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 게시판 글 수정
 */
exports.modifyBoard = async (req, res, next) => {
    const board = req.body;
    board.userId = req.user.USER_ID;
    
    try {
        await manageService.modifyBoard(board);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 게시판 글 삭제
 */
exports.removeBoard = async (req, res, next) => {
    const userId = req.user.USER_ID;
    const sbId = req.params.sbId;

    try {
        await manageService.removeBoard(userId, sbId);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 팀원 목록 조회
 */
exports.getStudyMember = async (req, res, next) => {
    const sgId = req.params.sgId;

    try {
        const result = await manageService.getStudyMember(sgId);
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
};