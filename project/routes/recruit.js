// 스터디 모집 관련 라우터
const express = require('express');
const db = require('../lib/db');
const recruitQuery = require('../queries/recruit');
const router = express.Router();

/** 
 * 스터디모집글 목록 조회
 */
router.get('/', (req, res, next) => {
    db.query(recruitQuery.getRecruit, (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }
        res.json(result);
    });
});

/**
 * 스터디모집글 상세 조회
 */
router.get('/detail/:sgId', (req, res, next) => {
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const sgId = req.params.sgId;

    // 조회수 증가
    db.query(`
        UPDATE STUDY_RCRTM 
           SET SR_VIEWS = SR_VIEWS + 1
         WHERE SG_ID = ?
    `, [sgId], (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }
    });

    // 상세조회
    db.query(
        recruitQuery.getRecruitDetail, [userId, sgId], (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }
        res.json(result);
    });
});

/**
 * 스터디모집글 상세 댓글 조회
 */
router.get('/comment/:sgId', (req, res, next) => {
    const sgId = req.params.sgId;

    db.query(recruitQuery.getRecruitComment, [sgId], (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }
        res.json(result);
    })
});

/**
 * 스터디모집글 상세 댓글 등록
 */
router.post('/comment', (req, res, next) => {
    const comment = req.body;
    const userId = 1; // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기

    db.query(recruitQuery.createRecruitComment, [comment.sgId, comment.srcContent, userId, userId], (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }
        res.json(result);
    });
});

/**
 * 스터디모집글 상세 댓글 수정
 */
router.put('/comment', (req, res, next) => {
    const comment = req.body;
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기

    db.query(recruitQuery.modifyRecruitComment, [comment.srcContent, userId, comment.srcId], (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }
        res.json(result);
    });
});

/**
 * 스터디모집글 상세 댓글 삭제
 */
router.delete('/comment/:srcId', (req, res, next) => {
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const srcId = req.params.srcId;

    db.query(recruitQuery.removeRecruitComment, [userId, srcId], (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }
        res.json(result);
    });
});

/**
 * 공통코드 조회
 */
router.get('/comCd/:cgcName', async (req, res, next) => {
    const cgcName = req.params.cgcName;

    try {
        // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
        const result = await db.query(recruitQuery.getRecruitComCd, [cgcName]);
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

/**
 * 스터디 / 스터디 모집글 생성
 */
router.post('/', async (req, res, next) => {
    // [TODO] 트랜잭션 처리
    // [TODO] 결과값 반환 어떤식으로 하는지.. result[0]말고
    const userId = 1;   // [TODO] 로그인 구현 후 세션에서 해당아이디 가져오기
    const {srTitle, sgName, sgCnt, sgCategory, stCode, srContent} = req.body;
    let sgId;
    let insertValues = ``;
    let paramArr = [];
    
    try {
        // await db.beginTransaction();
        const result = await db.query(recruitQuery.createStudyGroup, [sgName, sgCategory, sgCnt, userId, userId]);  // 스터디그룹
        sgId = result[0].insertId;
        
        await db.query(recruitQuery.createStudyRcrtm, [sgId, srTitle, srContent, userId, userId]);                  // 스터디모집글
        await db.query(recruitQuery.createStudyMember, [sgId, userId, userId, userId]);                             // 스터디멤버
        
        stCode.forEach((item, index) => { 
            insertValues += `
                (
                    ?
                    , '${item}'
                    , 'N'
                    , ?
                    , NOW()
                    , ?
                    , NOW()
                )
            `;
            insertValues += (index === (stCode.length - 1)) ? `` : `, `;
            paramArr = paramArr.concat([sgId, userId, userId]);             // 스터디 기술스택 생성 쿼리 파라미터 (insertValues가 생기는 개수만큼 파라미터 만들기)
        });

        await db.query(recruitQuery.createStudyTchsh + insertValues, paramArr);                                     // 스터디 기술스택
        // await db.commit();
    } catch (err) {
        console.error(err);
        // await db.rollback();
        next(err);
    }

    res.json({res: 'success'});
});

/**
 * 스터디 / 스터디모집글 수정
 */
router.put('/', (req, res, next) => {

});

/**
 * 스터디 폐쇄
 */
router.delete('/', (req, res, next) => {
    // 실제론 del_yn 수정
});

module.exports = router;