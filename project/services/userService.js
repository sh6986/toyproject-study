const pool = require('../lib/db');
const recruitQuery = require('../queries/recruitQuery');
const authQuery = require('../queries/authQuery');

/**
 * 내 스터디 목록 조회
 */
exports.getMyStudyList = async (userId) => {
    try {
        const result = await pool.query(recruitQuery.getRecruitList(userId), [userId]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 내 북마크 목록 조회
 */
exports.getStudyBkmList = async (userId) => {
    try {
        const result = await pool.query(recruitQuery.getRecruitList(false, userId), [userId]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 닉네임 수정
 */
exports.modifyNickname = async (user) => {
    const {userNickname, userId} = user;

    try {
        await pool.query(authQuery.modifyNickname, [userNickname, userId, userId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 회원 탈퇴
 */
exports.modifyScsn = async (userId) => {
    try {
        await pool.query(authQuery.modifyScsn, [userId, userId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};