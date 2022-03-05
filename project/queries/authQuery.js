// 로그인
exports.login = `
    SELECT USER_ID
         , USER_PASSWORD 
      FROM USER 
     WHERE USER_EMAIL = ?
       AND USER_SCSN_YN = 'N' 
       AND USER_DEL_YN = 'N'
`;

// 사용자 조회
exports.getUser = `
    SELECT USER_ID
         , USER_EMAIL
         , USER_NICKNAME
      FROM USER 
     WHERE USER_ID = ?
       AND USER_SCSN_YN = 'N' 
       AND USER_DEL_YN = 'N'
`;