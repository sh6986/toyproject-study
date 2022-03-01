const recruitService = require('../services/recruitService');

/**
 * 스터디모집글 상세 조회
 */
exports.getDetail = async (req, res) => {
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const sgId = req.params.sgId;

    try {
        // 조회수 증가
        await recruitService.modifyView(sgId);
        // 상세조회
        const result = await recruitService.getDetail(userId, sgId);

        return res.json(result[0]);    // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
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
    const userId = 1;
    const study = req.body;
    study.userId = userId;

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