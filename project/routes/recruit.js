// 스터디 모집 관련 라우터
const express = require('express');
const db = require('../lib/db');
const router = express.Router();

/** 
 * 스터디모집글 목록 조회
 */
router.get('/', (req, res, next) => {
    db.query(`
        SELECT TB.SG_ID
             , TB.SG_NAME
             , TB.SG_CATEGORY
             , TB.SG_CNT
             , TB.SR_TITLE
             , TB.SR_CONTENT
             , TB.SR_VIEWS, CONCAT('#', GROUP_CONCAT(DISTINCT(TB.CC_DESC)  SEPARATOR ' #')) AS ST_NAME 
          FROM (
                SELECT A.SG_ID
                     , A.SG_NAME
                     , A.SG_CATEGORY
                     , A.SG_CNT
                     , B.SR_TITLE
                     , B.SR_CONTENT
                     , B.SR_VIEWS
                     , D.CC_DESC 
                  FROM STUDY_GROUP AS A
                  LEFT JOIN STUDY_RCRTM AS B 
                    ON A.SG_ID = B.SG_ID
                  LEFT JOIN STUDY_TCHST AS C 
                    ON A.SG_ID = C.SG_ID AND C.ST_DEL_YN = 'N'
                  LEFT JOIN COM_CD AS D 
                    ON C.ST_CODE = D.CC_NAME AND D.CGC_NAME = 'ST_NAME' AND D.CC_DEL_YN = 'N'
                 WHERE A.SG_OPEN_YN = 'Y'
                   AND A.SG_DEL_YN = 'N'
                   AND B.SR_DEL_YN = 'N'
                 ORDER BY A.SG_ID
        ) AS TB
         GROUP BY TB.SG_ID
             , TB.SG_NAME
             , TB.SG_CATEGORY
             , TB.SG_CNT
             , TB.SR_TITLE
             , TB.SR_CONTENT
             , TB.SR_VIEWS
    `, (err, result) => {
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
    db.query(`
        SELECT A.SG_ID
             , A.SG_NAME 
             , A.SG_CATEGORY
             , A.SG_CNT
             , DATE_FORMAT(A.SG_REG_DATE,'%Y-%m-%d') AS SG_REG_DATE
             , B.SR_TITLE
             , B.SR_CONTENT
             , B.SR_VIEWS
             , E.USER_NICKNAME
             , CONCAT('#', GROUP_CONCAT(DISTINCT(D.CC_DESC) SEPARATOR ' #')) AS ST_NAME
             , COUNT(DISTINCT F.USER_ID) AS SRB_CNT
             , IF(COUNT(DISTINCT G.USER_ID), 'Y', 'N') AS SRB_YN
          FROM STUDY_GROUP AS A
          LEFT JOIN STUDY_RCRTM AS B 
            ON A.SG_ID = B.SG_ID
          LEFT JOIN STUDY_TCHST AS C
            ON A.SG_ID = C.SG_ID AND C.ST_DEL_YN = 'N'
          LEFT JOIN COM_CD AS D 
            ON C.ST_CODE = D.CC_NAME AND D.CGC_NAME = 'ST_NAME' AND D.CC_DEL_YN = 'N'
          LEFT JOIN USER AS E 
            ON A.SG_REG_ID = E.USER_ID AND E.USER_DEL_YN = 'N' AND E.USER_SCSN_YN = 'N'
          LEFT JOIN STUDY_RCRTM_BKM AS F 
            ON B.SG_ID = F.SG_ID AND F.SRB_DEL_YN = 'N'
          LEFT JOIN STUDY_RCRTM_BKM AS G
            ON B.SG_ID = G.SG_ID AND F.SRB_DEL_YN = 'N' AND G.USER_ID = ?
         WHERE A.SG_ID = ?
           AND A.SG_OPEN_YN = 'Y'
           AND A.SG_DEL_YN = 'N'
           AND B.SR_DEL_YN = 'N'
         GROUP BY A.SG_ID
                , A.SG_NAME 
                , A.SG_CATEGORY
                , A.SG_CNT
                , A.SG_REG_DATE
                , B.SR_TITLE
                , B.SR_CONTENT
                , B.SR_VIEWS
                , E.USER_NICKNAME
    `, [userId, sgId], (err, result) => {
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

    db.query(`
        SELECT A.SRC_ID
             , A.SRC_CONTENT
             , B.USER_NICKNAME
             , DATE_FORMAT(A.SRC_REG_DATE, '%Y-%m-%d %H:%i:%s') AS SRC_REG_DATE
         FROM STUDY_RCRTM_CMNTS AS A
         LEFT JOIN USER AS B 
           ON A.SRC_REG_ID = B.USER_ID AND B.USER_SCSN_YN = 'N' AND B.USER_DEL_YN = 'N'
        WHERE A.SG_ID = ? 
          AND A.SRC_DEL_YN = 'N'
        ORDER BY A.SRC_ID
    `, [sgId], (err, result) => {

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

    db.query(`
        INSERT INTO STUDY_RCRTM_CMNTS (
               SG_ID
             , SRC_CONTENT
             , SRC_DEL_YN 
             , SRC_REG_ID 
             , SRC_REG_DATE 
             , SRC_UDT_ID 
             , SRC_UDT_DATE
        ) VALUES (
               ?
             , ?
             , 'N'
             , ?
             , NOW()
             , ?
             , NOW()
        )
    `, [comment.sgId, comment.srcContent, userId, userId], (err, result) => {
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

    db.query(`
        UPDATE STUDY_RCRTM_CMNTS 
           SET SRC_CONTENT = ?
             , SRC_UDT_ID = ?
             , SRC_UDT_DATE = NOW()
         WHERE SRC_ID = ?
    `, [comment.srcContent, userId, comment.srcId], (err, result) => {

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

    db.query(`
        UPDATE STUDY_RCRTM_CMNTS 
           SET SRC_DEL_YN = 'Y'
             , SRC_UDT_ID = ?
             , SRC_UDT_DATE = NOW()
         WHERE SRC_ID = ?
    `, [userId, srcId], (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }
        res.json(result);
    });
});



/**
 * 스터디종류(카테코리) 조회 (스터디 생성페이지)
 * [TODO] 스터디 상세 페이지 라우터에서 조회해서 넘겨주기
 */
router.get('/category', (req, res, next) => {
    // [TODO] del_yn 처리 필요
    db.query(`
        SELECT A.cc_name, A.cc_desc FROM COM_CD AS A 
        LEFT JOIN COM_GRP_CD AS B 
        ON A.CGC_NAME = B.CGC_NAME
        WHERE B.CGC_NAME = 'sg_category'
    `, (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }
        res.json(result);
    });
});

/**
 * 기술스택 조회 (스터디 생성페이지)
 * [TODO] 스터디 상세 페이지 라우터에서 조회해서 넘겨주기
 */
router.get('/tech', (req, res, next) => {
    db.query(`
        SELECT A.cc_name, A.cc_desc FROM COM_CD AS A 
        LEFT JOIN COM_GRP_CD AS B 
        ON A.CGC_NAME = B.CGC_NAME
        WHERE B.CGC_NAME = 'st_name'
    `, (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }
        res.json(result);
    });
});


/**
 * 스터디 생성 (동시에 모집글 생성)
 */
router.post('/', (req, res, next) => {
    // [TODO] 동시에 모집글 생성
    // [TODO] 트랜잭션 처리
    const study = req.body.study;
    //     study: {
    //       srTitle: 'aa',
    //       sgName: 'bb',
    //       sgCnt: '4',
    //       sgCategory: '001',
    //       stCode: [ '001', '004' ],
    //       srContent: 'vsdev'
    //     }

    // 스터디그룹
    // db.query(`
    //     INSERT INTO study.study_group (
    //            sg_name, sg_category, sg_cnt, sg_open_yn, sg_del_yn, sg_reg_id, sg_reg_date, sg_udt_id, sg_udt_date)
    //     VALUES(?, ?, ?, 'Y', 'N', 1, CURRENT_TIMESTAMP, 0, CURRENT_TIMESTAMP)
    // `, [study.sgName, study.sgCategory, study.sgCnt],  (err, result) => {

    // });

    // // 스터디 기술스택
    // db.query(`
    //     INSERT INTO study.study_tchst
    //     (sg_id, st_code, st_del_yn, st_reg_id, st_reg_date, st_udt_id, st_udt_date)
    //     VALUES(1, ?, 'N', 0, CURRENT_TIMESTAMP, 0, '')
    // `, [study.stCode], (err, result) => {
            
    // });

    // // 스터디멤버
    // db.query(`
    //     INSERT INTO study.study_member
    //     (sg_id, user_id, sm_auth, sm_del_yn, sm_reg_id, sm_reg_date, sm_udt_id, sm_udt_date)
    //     VALUES(1, 1, 0, 'N', 1, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP)
    // `, (err, result) => {
            
    // });

    // // 스터디모집글
    // db.query(`
    //     INSERT INTO study.study_rcrtm
    //     (sg_id, sr_title, sr_content, sr_views, sr_del_yn, sr_reg_id, sr_reg_date, sr_udt_id, sr_udt_date)
    //     VALUES(1, ?, ?, 0, 'N', 1, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP)
    // `, [study.srTitle, study.srContent], (err, result) => {
            
    // });

    res.json({test: 'aa'});
});

/**
 * 스터디 수정
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