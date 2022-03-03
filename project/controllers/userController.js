const userService = require('../services/userService');

/**
 * 내 스터디 목록 조회
 */
exports.getMyStudyList = async (req, res) => {
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    
    try {
        const result = await userService.getMyStudyList(userId);
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};