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
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const {sgId, sbTitle, sbContent, sbNoticeYn} = board;

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
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const {sbId, sbTitle, sbContent, sbNoticeYn} = board;
    
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
exports.removeBoard = async (sbId) => {
    const userId = 1;

    try {
        await pool.query(manageQuery.removeBoard, [userId, sbId]);
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};