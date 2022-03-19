const recruitService = require('../services/recruitService');

/**
 * 스터디모집글 목록 조회
 */
exports.getList = async (req, res, next) => {
    try {
        const result = await recruitService.getList();
        res.json(result);    
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 스터디모집글 상세 조회
 */
exports.getDetail = async (req, res, next) => {
    const sgId = req.params.sgId;

    try {
        // 조회수 증가
        await recruitService.modifyView(sgId);
        // 상세조회
        const result = await recruitService.getDetail(sgId);
        res.json(result[0]);    
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 스터디 / 스터디 모집글 생성
 */
exports.createStudy = async (req, res, next) => {
    const study = req.body;
    study.userId = req.user.USER_ID;

    try {
        const sgId = await recruitService.createStudy(study);
        res.json({sgId});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 스터디 / 스터디모집글 수정
 */
 exports.modifyStudy = async (req, res, next) => {
    const study = req.body;
    study.userId = req.user.USER_ID;

    try {
        await recruitService.modifyStudyGroup(study);
        res.json({
            sgId: study.sgId
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 스터디 모집완료
 */
exports.modifyComplete = async (req, res, next) => {
    const userId = req.user.USER_ID;
    const sgId = req.params.sgId;

    try {   
        await recruitService.modifyComplete(userId, sgId);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 스터디 모집열기
 */
exports.modifyOpen = async (req, res, next) => {
    const userId = req.user.USER_ID;
    const sgId = req.params.sgId;

    try {   
        await recruitService.modifyOpen(userId, sgId);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 스터디 멤버 생성
 */
exports.createMember = async (req, res, next) => {
    const study = req.body;
    study.userId = req.user.USER_ID;

    try {
        await recruitService.createMember(study);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 스터디 북마크 등록
 */
exports.createStudyBkm = async (req, res, next) => {
    const userId = req.user.USER_ID;
    const sgId = req.body.sgId;

    try {   
        await recruitService.createStudyBkm(userId, sgId);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 스터디 북마크 취소
 */
exports.modifyStudyBkm = async (req, res, next) => {
    const userId = req.user.USER_ID;
    const sgId = req.body.sgId;

    try {
        await recruitService.modifyStudyBkm(userId, sgId);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 스터디모집글 댓글 조회
 */
exports.getComment = async (req, res, next) => {
    const sgId = req.params.sgId;

    try {
        const result = await recruitService.getComment(sgId);
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 스터디모집글 댓글 등록
 */
 exports.createComment = async (req, res, next) => {
    const comment = req.body;
    comment.userId = req.user.USER_ID;

    try {
        await recruitService.createComment(comment);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 스터디모집글 댓글 수정
 */
exports.modifyComment = async (req, res, next) => {
    const comment = req.body;
    comment.userId = req.user.USER_ID;

    try {
        await recruitService.modifyComment(comment);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 스터디모집글 댓글 삭제
 */
exports.removeComment = async (req, res, next) => {
    const userId = req.user.USER_ID;
    const srcId = req.params.srcId;

    try {
        await recruitService.removeComment(userId, srcId);
        res.json({});
    } catch (err) {
        console.error(err);
        next(err);
    }
};

/**
 * 공통코드 조회
 */
exports.getComCd = async (req, res, next) => {
    const cgcName = req.params.cgcName;

    try {
        const result = await recruitService.getComCd(cgcName);
        res.json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

