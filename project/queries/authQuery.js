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

// 이메일 중복조회
exports.getEmailDup = `
    SELECT USER_ID
         , USER_EMAIL
         , USER_NICKNAME
         , USER_SCSN_YN
         , USER_SCSN_DATE 
      FROM USER 
     WHERE USER_EMAIL = ?
       AND USER_DEL_YN = 'N'
`;

// 다음 시퀀스 ID 가져오기
exports.getNextId = `
    SELECT AUTO_INCREMENT 
      FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = 'study' 
       AND TABLE_NAME = ?
`;

// 회원가입
exports.createUser = `
    INSERT INTO USER (
           USER_EMAIL 
         , USER_PASSWORD 
         , USER_NICKNAME 
         , USER_PROVIDER
         , USER_SNS_ID
         , USER_SCSN_YN 
         , USER_SCSN_DATE 
         , USER_DEL_YN 
         , USER_REG_ID 
         , USER_REG_DATE 
         , USER_UDT_ID 
         , USER_UDT_DATE 
    ) VALUES (
           ?
         , ?
         , ?
         , ?
         , ?
         , 'N'
         , NULL
         , 'N'
         , ?
         , NOW()
         , ?
         , NOW()
    )
`;

// 카카오 로그인
exports.kakaoLogin = `
    SELECT USER_ID
         , USER_EMAIL
         , USER_NICKNAME
      FROM USER
     WHERE USER_PROVIDER = 'kakao'
       AND USER_SNS_ID = ?
       AND USER_DEL_YN = 'N'
       AND USER_SCSN_YN = 'N'
`;