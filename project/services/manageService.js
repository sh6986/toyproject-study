const pool = require('../lib/db');
const manageQuery = require('../queries/manageQuery');

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
}