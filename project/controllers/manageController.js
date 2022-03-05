const manageService = require('../services/manageService');

/**
 * 게시판 목록 조회
 */
exports.getBoardList = async (req, res) => {
    const sgId = req.params.sgId;
    
    try {
        const result = await manageService.getBoardList(sgId);
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};

/**
 * 게시판 상세 조회
 */
exports.getBoardDetail = async (req, res) => {
    const sbId = req.params.sbId;

    try {
        // 조회수 증가
        await manageService.modifyBoardViews(sbId);
        // 상세조회
        const result = await manageService.getBoardDetail(sbId);
        return res.json(result[0]);
    } catch (err) {
        console.error(err)
        return res.status(500).json(err);
        // next(err);
    }
};

/**
 * 게시판 글 생성
 */
exports.createBoard = async (req, res) => {
    const board = req.body;
    board.userId = req.user.USER_ID;

    try {
        const sbId = await manageService.createBoard(board);
        return res.json({sbId});
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};

/**
 * 게시판 글 수정
 */
exports.modifyBoard = async (req, res) => {
    const board = req.body;
    board.userId = req.user.USER_ID;
    
    try {
        await manageService.modifyBoard(board);
        return res.json({});
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};

/**
 * 게시판 글 삭제
 */
exports.removeBoard = async (req, res) => {
    const userId = req.user.USER_ID;
    const sbId = req.params.sbId;

    try {
        await manageService.removeBoard(userId, sbId);
        return res.json({});
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};