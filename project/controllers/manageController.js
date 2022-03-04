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
    const sbId = req.params.sbId;

    try {
        await manageService.removeBoard(sbId);
        return res.json({});
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};