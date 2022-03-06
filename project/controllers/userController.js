const userService = require('../services/userService');

/**
 * 내 스터디 목록 조회
 */
exports.getMyStudyList = async (req, res) => {
    const userId = req.user.USER_ID;

    try {
        const result = await userService.getMyStudyList(userId);
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};

/**
 * 내 북마크 목록 조회
 */
exports.getStudyBkmList = async (req, res) => {
    const userId = req.user.USER_ID;

    try {
        const result = await userService.getStudyBkmList(userId);
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}