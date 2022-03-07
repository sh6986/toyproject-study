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

