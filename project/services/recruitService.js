const pool = require('../lib/db');
const recruitQuery = require('../queries/recruit');

/**
 * 스터디모집글 상세 조회
 */
exports.getDetail = async (userId, sgId) => {
    try {
        const result = await pool.query(recruitQuery.getRecruitDetail, [userId, sgId]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 스터디모집글 조회수 증가
 */
exports.modifyView = async (sgId) => {
    try {
        await pool.query(recruitQuery.modifyStudyRcrmViews, [sgId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 스터디 / 스터디모집글 수정
 */
exports.modifyStudyGroup = async (study) => {
    const conn = await pool.getConnection();
    const {sgName, sgCategory, sgCnt, sgId, stCode, srTitle, srContent, userId} = study;
    let insertValues = ``;
    let paramArr = [];

    try {
        await conn.beginTransaction();
        await conn.query(recruitQuery.modifyStudyGroup, [sgName, sgCategory, sgCnt, userId, sgId]);
        await conn.query(recruitQuery.modifyStudyRcrtm, [srTitle, srContent, userId, sgId]);
        await conn.query(recruitQuery.modifyStudyTchst, [userId, sgId]);
        stCode.forEach((item, index) => { 
            insertValues += `
                (?, '${item}', 'N', ?, NOW(), ?, NOW())
            `;
            insertValues += (index === (stCode.length - 1)) ? `` : `, `;
            paramArr = paramArr.concat([sgId, userId, userId]);             // 스터디 기술스택 생성 쿼리 파라미터 (insertValues가 생기는 개수만큼 파라미터 만들기)
        });
        await conn.query(recruitQuery.createStudyTchsh + insertValues, paramArr);
        await conn.commit();
    } catch (err) {
        console.error(err);
        await conn.rollback();
        throw Error(err);
    } finally {
        await conn.release();
    }
};
