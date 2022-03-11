// 스터디 멤버 삭제
exports.removeStudyMember = `
    UPDATE STUDY_MEMBER 
       SET SM_DEL_YN = 'Y'
         , SM_UDT_ID = ?
         , SM_UDT_DATE = NOW()
     WHERE SG_ID = ? AND USER_ID = ?
`;

// 스터디 규칙 등록 / 수정
exports.modifyStudyRule = `
    UPDATE STUDY_GROUP 
       SET SG_RULE = ?
         , SG_UDT_ID = ?
         , SG_UDT_DATE = NOW()
     WHERE SG_ID = ?
`;

// 일정 목록 조회
exports.getScheduleList = `
    SELECT SS_ID
         , SS_TOPIC
         , SS_PLACE
         , SS_TIME 
         , DATE_FORMAT(SS_DATE,'%Y-%m-%d') AS SS_DATE
         , DATE_FORMAT(SS_DATE,'%H') AS SS_DATE_HOUR
         , DATE_FORMAT(DATE_ADD(SS_DATE, INTERVAL SS_TIME HOUR),'%Y-%m-%d') AS SS_END_DATE
         , DATE_FORMAT(DATE_ADD(SS_DATE, INTERVAL SS_TIME HOUR),'%H') AS SS_END_DATE_HOUR
      FROM STUDY_SCHEDULE
     WHERE SS_DEL_YN = 'N'
       AND SG_ID = ?
     ORDER BY SS_ID DESC
`;

// 일정 상세 조회
exports.getScheduleDetail = `
    SELECT SG_ID
         , SS_ID
         , SS_TOPIC
         , SS_CONTENT 
         , SS_PLACE
         , SS_TIME 
         , DATE_FORMAT(SS_DATE,'%Y-%m-%d') AS SS_DATE
         , DATE_FORMAT(SS_DATE,'%H') AS SS_DATE_HOUR
         , DATE_FORMAT(DATE_ADD(SS_DATE, INTERVAL SS_TIME HOUR),'%Y-%m-%d') AS SS_END_DATE
         , DATE_FORMAT(DATE_ADD(SS_DATE, INTERVAL SS_TIME HOUR),'%H') AS SS_END_DATE_HOUR
         , SS_REG_ID
         , DATE_FORMAT(SS_REG_DATE,'%Y-%m-%d %H:%i:%s') AS SS_REG_DATE 
      FROM STUDY_SCHEDULE
     WHERE SS_DEL_YN = 'N'
       AND SS_ID = ?
`;

// 일정 등록
exports.createSchedule = `
    INSERT INTO STUDY_SCHEDULE (
           SG_ID
         , SS_TOPIC
         , SS_CONTENT 
         , SS_PLACE 
         , SS_DATE 
         , SS_TIME 
         , SS_DEL_YN 
         , SS_REG_ID 
         , SS_REG_DATE 
         , SS_UDT_ID 
         , SS_UDT_DATE 
    ) VALUES (
           ?
         , ?
         , ?
         , ?
         , ?
         , ?
         , 'N'
         , ?
         , NOW()
         , ?
         , NOW()
    )
`;

// 일정 수정
exports.modifySchedule = `
    UPDATE STUDY_SCHEDULE 
       SET SS_TOPIC = ?
         , SS_CONTENT = ?
         , SS_PLACE = ?
         , SS_DATE = ?
         , SS_TIME = ?
         , SS_UDT_ID = ?
         , SS_UDT_DATE = NOW()
     WHERE SS_ID = ?
`;

// 일정 삭제
exports.removeSchedule = `
    UPDATE STUDY_SCHEDULE 
       SET SS_DEL_YN = 'Y'
         , SS_UDT_ID = ?
         , SS_UDT_DATE = NOW()
     WHERE SS_ID = ?
`;

// 일정 출결 목록 조회
exports.getScheduleAtndnList = `
    SELECT TB.USER_ID AS USER_ID
         , TB.USER_NICKNAME AS USER_NICKNAME
         , SUM(TB.ATTEND) AS ATTEND
         , SUM(TB.ABSENCE) AS ABSENCE
         , SUM(TB.BEINGLATE) AS BEINGLATE
      FROM (
            SELECT A.USER_ID 
                 , B.USER_NICKNAME 
                 , IFNULL(CASE WHEN D.SSA_STATUS = '001' THEN COUNT(D.SSA_STATUS) END, 0) AS ATTEND
                 , IFNULL(CASE WHEN D.SSA_STATUS = '002' THEN COUNT(D.SSA_STATUS) END, 0) AS ABSENCE
                 , IFNULL(CASE WHEN D.SSA_STATUS = '003' THEN COUNT(D.SSA_STATUS) END, 0) AS BEINGLATE
              FROM STUDY_MEMBER AS A
              LEFT JOIN USER AS B 
                ON A.USER_ID = B.USER_ID AND B.USER_DEL_YN = 'N'
              LEFT JOIN STUDY_SCHEDULE AS C 
                ON A.SG_ID = C.SG_ID AND C.SS_DEL_YN = 'N'
              LEFT JOIN STUDY_SCHEDULE_ATNDN AS D
                ON A.USER_ID = D.SSA_REG_ID AND C.SS_ID = D.SS_ID AND D.SSA_DEL_YN = 'N'
              LEFT JOIN COM_CD AS E 
                ON D.SSA_STATUS = E.CC_NAME AND E.CGC_NAME = 'ssa_status' AND E.CC_DEL_YN = 'N'
             WHERE A.SG_ID = ?
               AND A.SM_DEL_YN = 'N'
             GROUP BY A.USER_ID
                    , B.USER_NICKNAME
                    , D.SSA_STATUS
                    , E.CC_DESC 
             ORDER BY A.USER_ID
      ) AS TB
     GROUP BY TB.USER_ID
`;

// 일정 출결 상세 조회
exports.getScheduleAtndn = `
    SELECT A.SG_ID
         , A.USER_ID
         , B.USER_NICKNAME 
         , C.SS_ID
         , D.SSA_ID
         , D.SSA_STATUS 
         , E.CC_DESC 
      FROM STUDY_MEMBER AS A
      LEFT JOIN USER AS B 
        ON A.USER_ID = B.USER_ID AND B.USER_DEL_YN = 'N'
      LEFT JOIN STUDY_SCHEDULE AS C 
        ON A.SG_ID = C.SG_ID 
      LEFT JOIN STUDY_SCHEDULE_ATNDN AS D 
        ON A.USER_ID = D.SSA_REG_ID AND C.SS_ID = D.SS_ID AND D.SSA_DEL_YN = 'N'
      LEFT JOIN COM_CD AS E 
        ON D.SSA_STATUS = E.CC_NAME AND E.CGC_NAME = 'ssa_status' AND E.CC_DEL_YN = 'N'
     WHERE A.SM_DEL_YN = 'N'
       AND C.SS_DEL_YN = 'N'
       AND C.SS_ID = ?
`;

// 일정 출결 투표 등록
exports.createScheduleAtndn = `
    INSERT INTO STUDY_SCHEDULE_ATNDN (
           SS_ID
         , SSA_STATUS 
         , SSA_DEL_YN 
         , SSA_REG_ID 
         , SSA_REG_DATE 
         , SSA_UDT_ID 
         , SSA_UDT_DATE 
    ) VALUES (
           ?
         , ?
         , 'N'
         , ?
         , NOW()
         , ?
         , NOW()
    )
`;

// 일정 출결 투표 수정
exports.modifyScheduleAtndn = `
    UPDATE STUDY_SCHEDULE_ATNDN 
       SET SSA_STATUS = ?
         , SSA_UDT_ID = ?
         , SSA_UDT_DATE = NOW()
     WHERE SSA_ID = ?
`;

// 게시판 목록 조회
exports.getBoardList = `
    SELECT A.SG_ID
         , A.SB_ID
         , A.SB_TITLE 
         , A.SB_VIEWS
         , A.SB_NOTICE_YN
         , B.USER_NICKNAME
         , DATE_FORMAT(A.SB_REG_DATE,'%Y-%m-%d %H:%i:%s') AS SB_REG_DATE
      FROM STUDY_BOARD AS A
      LEFT JOIN USER AS B
        ON A.SB_REG_ID = B.USER_ID AND B.USER_DEL_YN = 'N' AND B.USER_SCSN_YN = 'N'
     WHERE A.SG_ID = ? 
       AND A.SB_DEL_YN = 'N'
`;

// 게시판 상세 조회
exports.getBoardDetail = `
    SELECT A.SB_TITLE 
         , A.SB_CONTENT 
         , A.SB_VIEWS
         , A.SB_NOTICE_YN
         , A.SB_REG_ID 
         , B.USER_NICKNAME
         , DATE_FORMAT(A.SB_REG_DATE,'%Y-%m-%d %H:%i:%s') AS SB_REG_DATE
      FROM STUDY_BOARD AS A
      LEFT JOIN USER AS B
        ON A.SB_REG_ID = B.USER_ID AND B.USER_DEL_YN = 'N' AND B.USER_SCSN_YN = 'N'
     WHERE A.SB_ID = ?
       AND A.SB_DEL_YN = 'N'
`;

// 게시판 조회수 증가
exports.modifyBoardViews = `
    UPDATE STUDY_BOARD 
       SET SB_VIEWS = SB_VIEWS + 1
     WHERE SB_ID = ?
`;

// 게시판 글 생성
exports.createBoard = `
    INSERT INTO STUDY_BOARD (
           SG_ID
         , SB_TITLE 
         , SB_CONTENT 
         , SB_VIEWS 
         , SB_NOTICE_YN 
         , SB_DEL_YN 
         , SB_REG_ID 
         , SB_REG_DATE 
         , SB_UDT_ID 
         , SB_UDT_DATE 
    ) VALUES (
           ?
         , ?
         , ?
         , 0
         , ?
         , 'N'
         , ?
         , NOW()
         , ?
         , NOW()
    )
`;

// 게시판 글 수정
exports.modifyBoard = `
    UPDATE STUDY_BOARD 
       SET SB_TITLE = ?
         , SB_CONTENT = ?
         , SB_NOTICE_YN = ?
         , SB_UDT_ID = ?
         , SB_UDT_DATE = NOW()
     WHERE SB_ID = ?
`;

// 게시판 글 삭제
exports.removeBoard = `
    UPDATE STUDY_BOARD 
       SET SB_DEL_YN = 'Y'
         , SB_UDT_ID = ?
         , SB_UDT_DATE = NOW()
     WHERE SB_ID = ?
`;

// 팀원 목록 조회
exports.getStudyMember = `
    SELECT A.USER_ID
         , A.SG_ID
         , B.USER_NICKNAME
         , C.CC_DESC 
      FROM STUDY_MEMBER AS A
      LEFT JOIN USER AS B 
        ON A.USER_ID = B.USER_ID
      LEFT JOIN COM_CD AS C 
        ON A.SM_AUTH = C.CC_NAME AND C.CGC_NAME = 'SM_AUTH'
     WHERE A.SG_ID = ?
       AND A.SM_DEL_YN = 'N'
`;

