const pool = require('../lib/db');
const manageQuery = require('../queries/manageQuery');

/**
 * 스터디 멤버 삭제
 */
exports.removeStudyMember = async (sgId, userId) => {
    try {
        await pool.query(manageQuery.removeStudyMember, [userId, sgId, userId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 스터디 삭제 (폐쇄)
 */
exports.removeStudy = async (sgId, userId) => {
    try {
        await pool.query(manageQuery.removeStudy, [userId, sgId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
}

/**
 * 스터디 규칙 등록 / 수정
 */
exports.modifyStudyRule = async (study) => {
    const {sgId, sgRule, userId} = study;

    try {
        await pool.query(manageQuery.modifyStudyRule, [sgRule, userId, sgId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 일정 목록 조회
 */
exports.getScheduleList = async (sgId) => {
    try { 
        const result = await pool.query(manageQuery.getScheduleList, [sgId]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 일정 상세 조회
 */
exports.getScheduleDetail = async (ssId) => {
    try {
        const result = await pool.query(manageQuery.getScheduleDetail, [ssId]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 일정 등록
 */
exports.createSchedule = async (schedule) => {
    const {sgId, ssTopic, ssContent, ssPlace, ssDate, ssTime, userId} = schedule;

    try {
        const result = await pool.query(manageQuery.createSchedule, [sgId, ssTopic, ssContent, ssPlace, ssDate, ssTime, userId, userId]);
        ssId = result[0].insertId;
        return ssId;
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 일정 수정
 */
exports.modifySchedule = async (schedule) => {
    const {ssId, ssTopic, ssContent, ssPlace, ssDate, ssTime, userId} = schedule;

    try {
        await pool.query(manageQuery.modifySchedule, [ssTopic, ssContent, ssPlace, ssDate, ssTime, userId, ssId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 일정 삭제
 */
exports.removeSchedule = async (userId, ssId) => {
    try {
        await pool.query(manageQuery.removeSchedule, [userId, ssId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 팀원 목록 조회
 */
exports.getMemberList = async (sgId) => {
    try {
        const result = await pool.query(manageQuery.getMemberList, [sgId]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 일정 출결 상세 조회
 */
exports.getScheduleAtndn = async (ssId) => {
    try {
        const result = await pool.query(manageQuery.getScheduleAtndn, [ssId]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 일정 출결 투표 등록
 */
exports.createScheduleAtndn = async (scheduleAtndn) => {
    const {ssId, ssaStatus, userId} = scheduleAtndn;

    try {
        await pool.query(manageQuery.createScheduleAtndn, [ssId, ssaStatus, userId, userId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    } 
};

/**
 * 일정 출결 투표 수정
 */
exports.modifyScheduleAtndn = async (scheduleAtndn) => {
    const {ssaStatus, userId, ssaId} = scheduleAtndn;

    try {
        await pool.query(manageQuery.modifyScheduleAtndn, [ssaStatus, userId, ssaId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

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

/**
 * 게시판 상세 조회
 */
exports.getBoardDetail = async (sbId) => {
    try {
        const result = await pool.query(manageQuery.getBoardDetail, [sbId]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 게시판 조회수 증가
 */
exports.modifyBoardViews = async (sbId) => {
    try {
        await pool.query(manageQuery.modifyBoardViews, [sbId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 게시판 글 생성
 */
exports.createBoard = async (board) => {
    const {sgId, sbTitle, sbContent, sbNoticeYn, userId} = board;

    try {
        const result = await pool.query(manageQuery.createBoard, [sgId, sbTitle, sbContent, sbNoticeYn, userId, userId]);
        sbId = result[0].insertId;
        return sbId;
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 게시판 글 수정
 */
exports.modifyBoard = async (board) => {
    const {sbId, sbTitle, sbContent, sbNoticeYn, userId} = board;
    
    try {
        await pool.query(manageQuery.modifyBoard, [sbTitle, sbContent, sbNoticeYn, userId, sbId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 게시판 글 삭제
 */
exports.removeBoard = async (userId, sbId) => {
    try {
        await pool.query(manageQuery.removeBoard, [userId, sbId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 팀원 목록 조회
 */
exports.getStudyMember = async (sgId) => {
    try {
        const result = await pool.query(manageQuery.getStudyMember, [sgId]);
        return result[0];
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};

/**
 * 권한 수정
 */
exports.modifyModifyAuth = async (member) => {
    const {sgId, memberId, userId} = member;
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        await conn.query(manageQuery.modifyModifyAuth, ['002', userId, sgId, userId]);      // 팀장 -> 팀원으로 변경
        await conn.query(manageQuery.modifyModifyAuth, ['001', userId, sgId, memberId]);    // 팀원 -> 팀장으로 변경
        
        await conn.commit();
    } catch (err) {
        console.error(err);
        await conn.rollback();
        throw Error(err);
    } finally {
        await conn.release();
    }
};