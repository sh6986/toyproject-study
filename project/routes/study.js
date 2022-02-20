// 스터디 모집 관련 라우터
const express = require('express');
const db = require('../lib/db');
const router = express.Router();

/**
 * 스터디목록 조회
 */
router.get('/', (req, res) => {
    db.query(`
        SELECT * 
          FROM STUDY_GROUP AS A
          LEFT JOIN STUDY_RCRTM AS B
            ON A.SG_ID = B.SG_ID
    `, (err, result) => {
        console.log(result);
        // res.end();
        res.json(result);
    });
});

/**
 * 스터디 생성 (동시에 모집글 생성)
 */
router.post('/', (req, res) => {
    console.log(req.body);
    const study = req.body;
    // 스터디그룹
    db.query(`
        INSERT INTO study.study_group (
               sg_name, sg_category, sg_cnt, sg_open_yn, sg_del_yn, sg_reg_id, sg_reg_date, sg_udt_id, sg_udt_date)
        VALUES(?, ?, ?, 'Y', 'N', 1, CURRENT_TIMESTAMP, 0, CURRENT_TIMESTAMP)
    `, [study.sgName, study.sgCategory, study.sgCnt],  (err, result) => {

    });

    // 스터디 기술스택
    db.query(`
        INSERT INTO study.study_tchst
        (sg_id, st_name, st_del_yn, st_reg_id, st_reg_date, st_udt_id, st_udt_date)
        VALUES(1, ?, 'N', 0, CURRENT_TIMESTAMP, 0, '')
    `, [study.stName], (err, result) => {
            
    });

    // 스터디멤버
    db.query(`
        INSERT INTO study.study_member
        (sg_id, user_id, sm_auth, sm_del_yn, sm_reg_id, sm_reg_date, sm_udt_id, sm_udt_date)
        VALUES(1, 1, 0, 'N', 1, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP)
    `, (err, result) => {
            
    });

    // 스터디모집글
    db.query(`
        INSERT INTO study.study_rcrtm
        (sg_id, sr_title, sr_content, sr_views, sr_del_yn, sr_reg_id, sr_reg_date, sr_udt_id, sr_udt_date)
        VALUES(1, ?, ?, 0, 'N', 1, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP)
    `, [study.srTitle, study.srContent], (err, result) => {
            
    });

    // res.json({test: 'aa'});
    res.redirect('/');
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
})

module.exports = router;