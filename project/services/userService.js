const pool = require('../lib/db');
const userQuery = require('../queries/userQuery');

/**
 * 내 스터디 목록 조회
 */
exports.getMyStudyList = async (userId) => {
    try {
        const result = await pool.query(userQuery.getMyStudyList, [userId]);
        return result[0];   // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};