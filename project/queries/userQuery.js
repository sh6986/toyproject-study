// 내 스터디 목록 조회
exports.getMyStudyList = `
    SELECT TB.SG_ID
         , TB.SG_NAME
         , TB.SG_CATEGORY
         , TB.SG_CNT
         , TB.SR_TITLE
         , TB.SR_CONTENT
         , TB.SR_VIEWS, CONCAT('#', GROUP_CONCAT(DISTINCT(TB.CC_DESC)  SEPARATOR ' #')) AS ST_NAME_DESC 
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
              LEFT JOIN STUDY_MEMBER AS E 
                ON A.SG_ID = E.SG_ID
              WHERE A.SG_OPEN_YN = 'Y'
                AND A.SG_DEL_YN = 'N'
                AND B.SR_DEL_YN = 'N'
                AND E.USER_ID = ?
              ORDER BY A.SG_ID
      ) AS TB
      GROUP BY TB.SG_ID
             , TB.SG_NAME
             , TB.SG_CATEGORY
             , TB.SG_CNT
             , TB.SR_TITLE
             , TB.SR_CONTENT
             , TB.SR_VIEWS
`;