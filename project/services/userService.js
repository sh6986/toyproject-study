const pool = require('../lib/db');
const recruitQuery = require('../queries/recruitQuery');

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