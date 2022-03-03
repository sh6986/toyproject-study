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