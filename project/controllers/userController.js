const logger = require('../logger');
const userService = require('../services/userService');

/**
 * 내 스터디 목록 조회
 */
exports.getMyStudyList = async (req, res, next) => {
    const userId = req.user.USER_ID;

    try {
        const result = await userService.getMyStudyList(userId);
        res.json(result);
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

/**
 * 내 북마크 목록 조회
 */
exports.getStudyBkmList = async (req, res, next) => {
    const userId = req.user.USER_ID;

    try {
        const result = await userService.getStudyBkmList(userId);
        res.json(result);
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

/**
 * 닉네임 수정
 */
exports.modifyNickname = async (req, res, next) => {
    const user = req.body;
    user.userId = req.user.USER_ID;

    try {
        await userService.modifyNickname(user);
        res.json({});
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

/**
 * 회원탈퇴
 */
exports.modifyScsn = async (req, res, next) => {
    const userId = req.user.USER_ID;

    try {
        await userService.modifyScsn(userId);
        req.logout();
        req.session.destroy();
        res.json({});
    } catch (err) {
        logger.error(err);
        next(err);
    }
};