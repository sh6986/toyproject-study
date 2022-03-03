const recruitService = require('../services/recruitService');

/**
 * 스터디모집글 목록 조회
 */
exports.getList = async (req, res) => {
    try {
        const result = await recruitService.getList();
        return res.json(result);    
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};

/**
 * 스터디모집글 상세 조회
 */
exports.getDetail = async (req, res) => {
    const sgId = req.params.sgId;

    try {
        // 조회수 증가
        await recruitService.modifyView(sgId);
        // 상세조회
        const result = await recruitService.getDetail(sgId);
        return res.json(result[0]);    
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};

/**
 * 스터디 / 스터디 모집글 생성
 */
exports.createStudy = async (req, res) => {
    const study = req.body;

    try {
        const sgId = await recruitService.createStudy(study);
        return res.json({sgId});
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};

/**
 * 스터디 / 스터디모집글 수정
 */
 exports.modifyStudy = async (req, res) => {
    const study = req.body;

    try {
        await recruitService.modifyStudyGroup(study);
        return res.json({
            sgId: study.sgId
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
};

/**
 * 스터디 모집완료
 */
exports.modifyComplete = async (req, res) => {
    const sgId = req.params.sgId;

    try {   
        await recruitService.modifyComplete(sgId);
        return res.json({});
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
};

/**
 * 스터디모집글 댓글 조회
 */
exports.getComment = async (req, res) => {
    const sgId = req.params.sgId;

    try {
        const result = await recruitService.getComment(sgId);
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};

/**
 * 스터디모집글 댓글 등록
 */
 exports.createComment = async (req, res) => {
    const comment = req.body;

    try {
        await recruitService.createComment(comment);
        return res.json({});   // [TODO] 조회아닌 등록이나 수정시 리턴값 고려해보기
    } catch (err) {
        console.error(err);
        return res.status(5000).json(err);
        // next(err);
    }
};

/**
 * 스터디모집글 댓글 수정
 */
exports.modifyComment = async (req, res) => {
    const comment = req.body;

    try {
        await recruitService.modifyComment(comment);
        return res.json({});   // [TODO] 조회아닌 등록이나 수정시 리턴값 고려해보기
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};

/**
 * 스터디모집글 댓글 삭제
 */
exports.removeComment = async (req, res) => {
    const srcId = req.params.srcId;

    try {
        await recruitService.removeComment(srcId);
        return res.json({});   // [TODO] 조회아닌 등록이나 수정시 리턴값 고려해보기
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};

/**
 * 공통코드 조회
 */
exports.getComCd = async (req, res) => {
    const cgcName = req.params.cgcName;

    try {
        const result = await recruitService.getComCd(cgcName);
        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
        // next(err);
    }
};

