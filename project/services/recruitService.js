const pool = require('../lib/db');
const recruitQuery = require('../queries/recruitQuery');

/**
 * 스터디모집글 목록 조회
 */
exports.getList = async (req, res) => {
    try {
        const result = await pool.query(recruitQuery.getRecruitList);
        return result[0];   // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 스터디모집글 상세 조회
 */
exports.getDetail = async (sgId) => {
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기

    try {
        const result = await pool.query(recruitQuery.getRecruitDetail, [userId, sgId]);
        return result[0];   // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
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
 * 스터디 / 스터디 모집글 생성
 */
exports.createStudy = async (study) => {
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const {sgName, sgCategory, sgCnt, srTitle, srContent, stCode} = study;
    const conn = await pool.getConnection();
    let sgId;
    let insertValues = ``;
    let paramArr = [];

    try {
        await conn.beginTransaction();
        const result = await conn.query(recruitQuery.createStudyGroup, [sgName, sgCategory, sgCnt, userId, userId]);  // 스터디그룹
        sgId = result[0].insertId;
        await conn.query(recruitQuery.createStudyRcrtm, [sgId, srTitle, srContent, userId, userId]);                  // 스터디모집글
        await conn.query(recruitQuery.createStudyMember, [sgId, userId, userId, userId]);                             // 스터디멤버

        if (stCode.length) {    // 기술스택(stCode)을 하나 이상 선택했을때 -> 아무것도 선택하지 않으면 insert 안함
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
        console.error(err);
        throw Error(err);
    } finally {
        await conn.release();
    }
}; 

/**
 * 스터디 / 스터디모집글 수정
 */
 exports.modifyStudyGroup = async (study) => {
    const userId = 1;
    const {sgName, sgCategory, sgCnt, sgId, stCode, srTitle, srContent} = study;
    let insertValues = ``;
    let paramArr = [];
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();
        await conn.query(recruitQuery.modifyStudyGroup, [sgName, sgCategory, sgCnt, userId, sgId]);
        await conn.query(recruitQuery.modifyStudyRcrtm, [srTitle, srContent, userId, sgId]);
        await conn.query(recruitQuery.modifyStudyTchst, [userId, sgId]);

        if (stCode.length) {    // 기술스택(stCode)을 하나 이상 선택했을때 -> 아무것도 선택하지 않으면 insert 안함
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
        console.error(err);
        await conn.rollback();
        throw Error(err);
    } finally {
        await conn.release();
    }
};

/**
 * 스터디 모집완료
 */
exports.modifyComplete = async (sgId) => {
    const userId = 1;

    try {
        await pool.query(recruitQuery.modifyComplete, [userId, sgId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 스터디모집글 댓글 조회
 */
exports.getComment = async (sgId) => {
    try {
        const result = await pool.query(recruitQuery.getRecruitComment, [sgId]);
        return result[0];   // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 스터디모집글 댓글 등록
 */
exports.createComment = async (comment) => {
    const userId = 1; // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const {sgId, srcContent} = comment;

    try {
        await pool.query(recruitQuery.createRecruitComment, [sgId, srcContent, userId, userId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 스터디모집글 댓글 수정
 */
exports.modifyComment = async (comment) => {
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const {srcContent, srcId} = comment;

    try {
        await pool.query(recruitQuery.modifyRecruitComment, [srcContent, userId, srcId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 스터디모집글 댓글 삭제
 */
exports.removeComment = async (srcId) => {
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기

    try {
        await pool.query(recruitQuery.removeRecruitComment, [userId, srcId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 공통코드 조회
 */
exports.getComCd = async (cgcName) => {
    try {
        // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
        const result = await pool.query(recruitQuery.getRecruitComCd, [cgcName]);
        return result[0];   
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};