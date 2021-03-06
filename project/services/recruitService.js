const logger = require('../logger');
const pool = require('../lib/db');
const recruitQuery = require('../queries/recruitQuery');

/**
 * 스터디모집글 목록 조회
 */
exports.getList = async () => {
    try {
        const result = await pool.query(recruitQuery.getRecruitList());
        return result[0];
    } catch (err) {
        logger.error(err);
        throw Error(err);
    }
};

/**
 * 스터디모집글 상세 조회
 */
exports.getDetail = async (sgId) => {
    try {
        const result = await pool.query(recruitQuery.getRecruitDetail, [sgId]);
        return result[0];
    } catch (err) {
        logger.error(err);
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
        logger.error(err);
        throw Error(err);
    }
};

/**
 * 스터디 / 스터디 모집글 생성
 */
exports.createStudy = async (study) => {
    const {sgName, sgCategory, sgCnt, srTitle, srContent, stCode, userId} = study;
    const conn = await pool.getConnection();
    let sgId;
    let insertValues = ``;
    let paramArr = [];

    try {
        await conn.beginTransaction();
        const result = await conn.query(recruitQuery.createStudyGroup, [sgName, sgCategory, sgCnt, userId, userId]);  // 스터디그룹
        sgId = result[0].insertId;
        await conn.query(recruitQuery.createStudyRcrtm, [sgId, srTitle, srContent, userId, userId]);                  // 스터디모집글
        await conn.query(recruitQuery.createStudyMember, [sgId, userId, '001',  userId, userId]);                     // 스터디멤버

        if (sgCategory !== '004') {    // 카테고리가 모각코일시 기술스택 선택안함
            stCode.forEach((item, index) => { 
                insertValues += `
                    (?, '${item}', 'N', ?, NOW(), ?, NOW())
                `;
                insertValues += (index === (stCode.length - 1)) ? `` : `, `;
                paramArr = paramArr.concat([sgId, userId, userId]);             // 스터디 기술스택 생성 쿼리 파라미터 (insertValues가 생기는 개수만큼 파라미터 만들기)
            });
    
            await conn.query(recruitQuery.createStudyTchsh + insertValues, paramArr);                                 // 스터디 기술스택
        } 
        await conn.commit();

        return sgId;
    } catch (err) {
        logger.error(err);
        await conn.rollback();
        throw Error(err);
    } finally {
        await conn.release();
    }
}; 

/**
 * 스터디 / 스터디모집글 수정
 */
 exports.modifyStudyGroup = async (study) => {
    const {sgName, sgCategory, sgCnt, sgId, stCode, srTitle, srContent, userId} = study;
    let insertValues = ``;
    let paramArr = [];
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();
        await conn.query(recruitQuery.modifyStudyGroup, [sgName, sgCategory, sgCnt, userId, sgId]);
        await conn.query(recruitQuery.modifyStudyRcrtm, [srTitle, srContent, userId, sgId]);
        await conn.query(recruitQuery.modifyStudyTchst, [userId, sgId]);

        if (sgCategory !== '004') {    // 카테고리가 모각코일시 기술스택 선택안함
            stCode.forEach((item, index) => { 
                insertValues += `
                    (?, '${item}', 'N', ?, NOW(), ?, NOW())
                `;
                insertValues += (index === (stCode.length - 1)) ? `` : `, `;
                paramArr = paramArr.concat([sgId, userId, userId]);             // 스터디 기술스택 생성 쿼리 파라미터 (insertValues가 생기는 개수만큼 파라미터 만들기)
            });
            await conn.query(recruitQuery.createStudyTchsh + insertValues, paramArr);
        }
        
        await conn.commit();
    } catch (err) {
        logger.error(err);
        await conn.rollback();
        throw Error(err);
    } finally {
        await conn.release();
    }
};

/**
 * 스터디 모집완료
 */
exports.modifyComplete = async (userId, sgId) => {
    try {
        await pool.query(recruitQuery.modifyComplete, ['N', userId, sgId]);
    } catch (err) {
        logger.error(err);
        throw Error(err);
    }
};

/**
 * 스터디 모집열기
 */
exports.modifyOpen = async (userId, sgId) => {
    try {
        await pool.query(recruitQuery.modifyComplete, ['Y', userId, sgId]);
    } catch (err) {
        logger.error(err);
        throw Error(err);
    }
};

/**
 * 스터디 멤버 생성
 */
exports.createMember = async (study) => {
    const {sgId, userId, sMCnt, sgCnt} = study;

    try {
        // 스터디 참가 - 스터디 멤버 추가
        await pool.query(recruitQuery.createStudyMember, [sgId, userId, '002', userId, userId]);

        // 스터디 참가 후 인원이 다 찼을 시 - 모집중여부를 N 으로 변경
        if (Number(sMCnt) === (sgCnt - 1)) {
            await pool.query(recruitQuery.modifyComplete, ['N', userId, sgId]);
        }
    } catch (err) {
        logger.error(err);
        throw Error(err);
    }
};

/**
 * 스터디 북마크 등록
 */
exports.createStudyBkm = async (userId, sgId) => {
    try {
        await pool.query(recruitQuery.createStudyBkm, [userId, sgId, userId, userId]);
    } catch (err) {
        logger.error(err);
        throw Error(err);
    }
};

/**
 * 스터디 북마크 취소
 */
exports.modifyStudyBkm = async (userId, sgId) => {
    try {
        await pool.query(recruitQuery.modifyStudyBkm, [userId, userId, sgId]);
    } catch (err) {
        logger.error(err);
        throw Error(err);
    }
};

/**
 * 스터디모집글 댓글 조회
 */
exports.getComment = async (sgId) => {
    try {
        const result = await pool.query(recruitQuery.getRecruitComment, [sgId]);
        return result[0];
    } catch (err) {
        logger.error(err);
        throw Error(err);
    }
};

/**
 * 스터디모집글 댓글 등록
 */
exports.createComment = async (comment) => {
    const {sgId, srcContent, userId} = comment;

    try {
        await pool.query(recruitQuery.createRecruitComment, [sgId, srcContent, userId, userId]);
    } catch (err) {
        logger.error(err);
        throw Error(err);
    }
};

/**
 * 스터디모집글 댓글 수정
 */
exports.modifyComment = async (comment) => {
    const {srcContent, srcId, userId} = comment;

    try {
        await pool.query(recruitQuery.modifyRecruitComment, [srcContent, userId, srcId]);
    } catch (err) {
        logger.error(err);
        throw Error(err);
    }
};

/**
 * 스터디모집글 댓글 삭제
 */
exports.removeComment = async (userId, srcId) => {
    try {
        await pool.query(recruitQuery.removeRecruitComment, [userId, srcId]);
    } catch (err) {
        logger.error(err);
        throw Error(err);
    }
};

/**
 * 공통코드 조회
 */
exports.getComCd = async (cgcName) => {
    try {
        const result = await pool.query(recruitQuery.getRecruitComCd, [cgcName]);
        return result[0];   
    } catch (err) {
        logger.error(err);
        throw Error(err);
    }
};