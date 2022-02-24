// 스터디 모집 관련 라우터
const express = require('express');
const db = require('../lib/db');
const router = express.Router();

/**
 * 스터디목록 조회
 */
router.get('/', (req, res) => {
    db.query(`
        SELECT A.SG_ID
             , A.SG_NAME
             , A.SG_CATEGORY
             , A.SG_CNT
             , A.SG_OPEN_YN
             , B.SR_TITLE
             , B.SR_CONTENT
             , B.SR_VIEWS
             , D.CC_NAME
             , D.CC_DESC 
          FROM STUDY_GROUP AS A
          LEFT JOIN STUDY_RCRTM AS B 
            ON A.SG_ID = B.SG_ID
          LEFT JOIN STUDY_TCHST AS C 
            ON A.SG_ID = C.SG_ID AND C.ST_DEL_YN = 'N'
          LEFT JOIN ( SELECT CC_NAME 
                           , CC_DESC 
                        FROM COM_CD
                       WHERE CC_DEL_YN = 'N'
                         AND CGC_NAME = 'ST_NAME' ) AS D 
            ON C.ST_CODE = D.CC_NAME
         WHERE A.SG_OPEN_YN = 'Y'
           AND A.SG_DEL_YN = 'N'
           AND B.SR_DEL_YN = 'N'
         ORDER BY A.SG_ID
    `, (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }
        console.log(result);
        res.json(result);
    });
});

/**
 * 스터디종류(카테코리) 조회
 */
router.get('/category', (req, res) => {
    // [TODO] del_yn 처리 필요
    db.query(`
        SELECT A.cc_name, A.cc_desc FROM COM_CD AS A 
        LEFT JOIN COM_GRP_CD AS B 
        ON A.CGC_ID = B.CGC_ID
        WHERE B.CGC_NAME = 'sg_category'
    `, (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }
        console.log(result);
        res.json(result);
    });
});

/**
 * 기술스택 조회
 */
router.get('/tech', (req, res) => {
    db.query(`
        SELECT A.cc_name, A.cc_desc FROM COM_CD AS A 
        LEFT JOIN COM_GRP_CD AS B 
        ON A.CGC_ID = B.CGC_ID
        WHERE B.CGC_NAME = 'st_name'
    `, (err, result) => {
        if (err) {
            console.error(err);
            next(err);
        }
        console.log(result);
        res.json(result);
    });
});


/**
 * 스터디 생성 (동시에 모집글 생성)
 */
router.post('/', (req, res) => {
    // [TODO] 동시에 모집글 생성
    // [TODO] 트랜잭션 처리
    console.log('=================');
    console.log(req.body);

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
router.put('/', (req, res) => {

});

/**
 * 스터디 폐쇄
 */
router.delete('/', (req, res) => {
    // 실제론 del_yn 수정
});

module.exports = router;