// 스터디모집글 목록 조회
exports.getRecruitList = (memberUserId, bkmUserId) => `
    SELECT TB.*
      FROM (
            SELECT A.SG_ID
                 , A.SG_NAME 
                 , A.SG_CATEGORY
                 , A.SG_CNT
                 , A.SG_OPEN_YN
                 , B.SR_TITLE
                 , B.SR_VIEWS
                 , H.CC_DESC AS SG_CATEGORY_DESC
                 , GROUP_CONCAT(DISTINCT(D.CC_DESC)) AS ST_NAME_DESC 
                 , COUNT(DISTINCT F.USER_ID) AS SRB_CNT
                 , COUNT(DISTINCT G.USER_ID) AS SM_CNT
              FROM STUDY_GROUP AS A
              LEFT JOIN STUDY_RCRTM AS B 
                ON A.SG_ID = B.SG_ID
              LEFT JOIN STUDY_TCHST AS C
                ON A.SG_ID = C.SG_ID AND C.ST_DEL_YN = 'N'
              LEFT JOIN COM_CD AS D 
                ON C.ST_CODE = D.CC_NAME AND D.CGC_NAME = 'ST_NAME' AND D.CC_DEL_YN = 'N'
              LEFT JOIN STUDY_RCRTM_BKM AS F 
                ON B.SG_ID = F.SG_ID AND F.SRB_DEL_YN = 'N'
              LEFT JOIN STUDY_MEMBER AS G 
                ON A.SG_ID = G.SG_ID AND G.SM_DEL_YN = 'N'
              LEFT JOIN COM_CD AS H 
                ON A.SG_CATEGORY = H.CC_NAME AND H.CGC_NAME = 'SG_CATEGORY' AND H.CC_DEL_YN = 'N'
              LEFT JOIN USER AS I 
              	ON A.SG_REG_ID = I.USER_ID 
              LEFT JOIN USER AS J
              	ON G.USER_ID = J.USER_ID 
             WHERE A.SG_DEL_YN = 'N'
               AND B.SR_DEL_YN = 'N'
               AND I.USER_DEL_YN = 'N'
               AND I.USER_SCSN_YN = 'N'
               AND J.USER_SCSN_YN = 'N' 
               AND J.USER_DEL_YN = 'N'
             GROUP BY A.SG_ID
                    , A.SG_NAME 
                    , A.SG_CATEGORY
                    , A.SG_CNT
                    , A.SG_OPEN_YN
                    , B.SR_TITLE
                    , B.SR_VIEWS
                    , H.CC_DESC
      ) AS TB
    ${memberUserId ? `
      LEFT JOIN STUDY_MEMBER AS I 
        ON TB.SG_ID = I.SG_ID AND I.SM_DEL_YN = 'N'
     WHERE I.USER_ID = ?
    ` : ``}
    ${bkmUserId ? `
      LEFT JOIN STUDY_RCRTM_BKM AS J 
        ON TB.SG_ID = J.SG_ID AND J.SRB_DEL_YN = 'N'
     WHERE J.USER_ID = ?
    ` : ``}
     ORDER BY TB.SG_OPEN_YN DESC
            , TB.SG_ID DESC
`;

// 스터디모집글 상세 조회
exports.getRecruitDetail = `
    SELECT A.SG_ID
         , A.SG_NAME 
         , A.SG_CATEGORY
         , A.SG_CNT
         , A.SG_RULE
         , A.SG_REG_ID 
         , DATE_FORMAT(A.SG_REG_DATE,'%Y-%m-%d') AS SG_REG_DATE
         , A.SG_OPEN_YN
         , B.SR_TITLE
         , B.SR_CONTENT
         , B.SR_VIEWS
         , E.USER_NICKNAME
         , E.USER_EMAIL 
         , GROUP_CONCAT(DISTINCT(D.CC_NAME)) AS ST_NAME
         , GROUP_CONCAT(DISTINCT(D.CC_DESC)) AS ST_NAME_DESC 			
         , COUNT(DISTINCT F.USER_ID) AS SRB_CNT
         , COUNT(DISTINCT G.USER_ID) AS SM_CNT
         , H.USER_ID AS LEAD_USER_ID
         , I.CC_DESC AS SG_CATEGORY_DESC
      FROM STUDY_GROUP AS A
      LEFT JOIN STUDY_RCRTM AS B 
        ON A.SG_ID = B.SG_ID
      LEFT JOIN STUDY_TCHST AS C
        ON A.SG_ID = C.SG_ID AND C.ST_DEL_YN = 'N'
      LEFT JOIN COM_CD AS D 
        ON C.ST_CODE = D.CC_NAME AND D.CGC_NAME = 'ST_NAME' AND D.CC_DEL_YN = 'N'
      LEFT JOIN USER AS E 
        ON A.SG_REG_ID = E.USER_ID
      LEFT JOIN STUDY_RCRTM_BKM AS F 
        ON B.SG_ID = F.SG_ID AND F.SRB_DEL_YN = 'N'
      LEFT JOIN STUDY_MEMBER AS G 
        ON A.SG_ID = G.SG_ID AND G.SM_DEL_YN = 'N'
      LEFT JOIN STUDY_MEMBER AS H 
        ON A.SG_ID = H.SG_ID AND H.SM_AUTH = '001' AND H.SM_DEL_YN = 'N'
      LEFT JOIN COM_CD AS I 
      	ON A.SG_CATEGORY = I.CC_NAME AND I.CGC_NAME = 'SG_CATEGORY' AND I.CC_DEL_YN = 'N'
      LEFT JOIN USER AS J 
      	ON G.USER_ID = J.USER_ID 
     WHERE A.SG_ID = ?
       AND A.SG_DEL_YN = 'N'
       AND B.SR_DEL_YN = 'N'
       AND J.USER_SCSN_YN = 'N'
       AND J.USER_DEL_YN = 'N'
     GROUP BY A.SG_ID
            , A.SG_NAME 
            , A.SG_CATEGORY
            , A.SG_CNT
            , A.SG_RULE
            , A.SG_REG_ID 
            , A.SG_REG_DATE
            , A.SG_OPEN_YN
            , B.SR_TITLE
            , B.SR_CONTENT
            , B.SR_VIEWS
            , E.USER_NICKNAME
            , E.USER_EMAIL 
            , H.USER_ID
`;

// 스터디모집글 조회수 증가
exports.modifyStudyRcrmViews = `
    UPDATE STUDY_RCRTM 
       SET SR_VIEWS = SR_VIEWS + 1
     WHERE SG_ID = ?
`;

// 스터디그룹 생성
exports.createStudyGroup = `
    INSERT INTO STUDY_GROUP (
           SG_NAME
         , SG_CATEGORY 
         , SG_CNT 
         , SG_OPEN_YN 
         , SG_DEL_YN 
         , SG_REG_ID 
         , SG_REG_DATE 
         , SG_UDT_ID 
         , SG_UDT_DATE 
    ) VALUES (
           ?
         , ?
         , ?
         , 'Y'
         , 'N'
         , ?
         , NOW()
         , ?
         , NOW()
    )
`;

// 스터디모집글 생성
exports.createStudyRcrtm = `
    INSERT INTO STUDY_RCRTM (
           SG_ID
         , SR_TITLE 
         , SR_CONTENT 
         , SR_VIEWS 
         , SR_DEL_YN 
         , SR_REG_ID 
         , SR_REG_DATE 
         , SR_UDT_ID 
         , SR_UDT_DATE 
    ) VALUES (
           ?
         , ?
         , ?
         , 0
         , 'N'
         , ?
         , NOW()
         , ?
         , NOW()
    )
`;

// 스터디멤버 생성
exports.createStudyMember = `
    INSERT INTO STUDY_MEMBER (
           SG_ID
         , USER_ID 
         , SM_AUTH 
         , SM_DEL_YN 
         , SM_REG_ID 
         , SM_REG_DATE 
         , SM_UDT_ID 
         , SM_UDT_DATE 
    ) VALUES (
           ?
         , ?
         , ?
         , 'N'
         , ?
         , NOW()
         , ?
         , NOW()
    )
`;

// 스터디기술스택 생성
exports.createStudyTchsh = `
    INSERT INTO STUDY_TCHST (
           SG_ID
         , ST_CODE 
         , ST_DEL_YN 
         , ST_REG_ID 
         , ST_REG_DATE 
         , ST_UDT_ID 
         , ST_UDT_DATE 
    ) VALUES
`;

// 스터디그룹 수정
exports.modifyStudyGroup = `
    UPDATE STUDY_GROUP 
       SET SG_NAME = ?
         , SG_CATEGORY = ?
         , SG_CNT = ?
         , SG_UDT_ID = ?
         , SG_UDT_DATE = NOW()
     WHERE SG_ID = ?
`;

// 스터디모집글 수정
exports.modifyStudyRcrtm = `
    UPDATE STUDY_RCRTM 
       SET SR_TITLE = ?
         , SR_CONTENT = ?
         , SR_UDT_ID = ?
         , SR_UDT_DATE = NOW()
     WHERE SG_ID = ?
`;

// 스터디기술스택 수정
exports.modifyStudyTchst = `
    UPDATE STUDY_TCHST 
       SET ST_DEL_YN = 'Y'
         , ST_UDT_ID = ?
         , ST_UDT_DATE = NOW()
     WHERE SG_ID = ?
`;

// 스터디 모집중여부 수정
exports.modifyComplete = `
    UPDATE STUDY_GROUP 
       SET SG_OPEN_YN = ? 
         , SG_UDT_ID = ?
         , SG_UDT_DATE = NOW()
     WHERE SG_ID = ?
`;

// 스터디 북마크 등록
exports.createStudyBkm = `
    INSERT INTO STUDY_RCRTM_BKM (
           USER_ID
         , SG_ID 
         , SRB_DEL_YN 
         , SRB_REG_ID 
         , SRB_REG_DATE 
         , SRB_UDT_ID 
         , SRB_UDT_DATE 
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

// 스터디 북마크 취소
exports.modifyStudyBkm = `
    UPDATE STUDY_RCRTM_BKM 
       SET SRB_DEL_YN ='Y'
         , SRB_UDT_ID = ?
         , SRB_UDT_DATE = NOW()
     WHERE USER_ID = ?
       AND SG_ID = ?
`

// 스터디모집글 댓글 조회
exports.getRecruitComment = `
    SELECT A.SRC_ID
         , A.SRC_CONTENT
         , A.SRC_REG_ID 
         , B.USER_NICKNAME
         , DATE_FORMAT(A.SRC_REG_DATE, '%Y-%m-%d %H:%i:%s') AS SRC_REG_DATE
      FROM STUDY_RCRTM_CMNTS AS A
      LEFT JOIN USER AS B 
        ON A.SRC_REG_ID = B.USER_ID
     WHERE A.SG_ID = ? 
       AND A.SRC_DEL_YN = 'N'
     ORDER BY A.SRC_ID
`;

//스터디모집글 댓글 등록
exports.createRecruitComment = `
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
`;

// 스터디모집글 댓글 수정
exports.modifyRecruitComment = `
    UPDATE STUDY_RCRTM_CMNTS 
       SET SRC_CONTENT = ?
         , SRC_UDT_ID = ?
         , SRC_UDT_DATE = NOW()
     WHERE SRC_ID = ?
`;

// 스터디모집글 댓글 삭제
exports.removeRecruitComment = `
    UPDATE STUDY_RCRTM_CMNTS 
       SET SRC_DEL_YN = 'Y'
         , SRC_UDT_ID = ?
         , SRC_UDT_DATE = NOW()
     WHERE SRC_ID = ?
`;

// 공통코드 조회
exports.getRecruitComCd = `
    SELECT B.CC_NAME
         , B.CC_DESC 
      FROM COM_GRP_CD AS A
      LEFT JOIN COM_CD AS B
        ON A.CGC_NAME = B.CGC_NAME
     WHERE A.CGC_NAME = ?
       AND A.CGC_DEL_YN = 'N'
       AND B.CC_DEL_YN = 'N'
`;
