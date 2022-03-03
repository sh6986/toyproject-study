const pool = require('../lib/db');
const manageQuery = require('../queries/manageQuery');

/**
 * 게시판 목록 조회
 */
exports.getBoardList = async (sgId) => {
    try {
        const result = await pool.query(manageQuery.getBoardList, [sgId]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};