const manageService = require('../services/manageService');

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