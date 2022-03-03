// 게시판 목록 조회
exports.getBoardList = `
    SELECT A.SB_TITLE 
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