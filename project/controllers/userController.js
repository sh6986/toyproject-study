const userService = require('../services/userService');

/**
 * 내 스터디 목록 조회
 */
exports.getMyStudyList = async (req, res) => {
    
    
    try {
        const result = await userService.getMyStudyList();
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};