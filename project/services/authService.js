const pool = require('../lib/db');
const authQuery = require('../queries/authQuery');
const bcrypt = require('bcrypt');

/**
 * 회원가입
 */
exports.createUser = async (user) => {
    const {userEmail, userPassword, userNickname} = user;

    try {
        // 이메일 중복조회
        const dupResult = await pool.query(authQuery.getEmailDup, [userEmail]);

        // [TODO] 상태랑 메세지 따로 정리, 관리 필요
        if (dupResult[0][0]) {  
            if (dupResult[0][0].USER_SCSN_YN === 'Y') {     // 탈퇴한 회원
                return {
                    status: '001',
                    message: '탈퇴한 회원입니다.'
                };
            } else {            // 이미 존재하는 이메일
                return {
                    status: '002',
                    message: '이미 존재하는 이메일입니다.'
                };
            }
        } else {                // 정상 회원가입
            // 회원가입
            const result = await pool.query(authQuery.getNextId, ['USER']);
            const nextId = result[0][0].AUTO_INCREMENT;
            const hashPassword = await bcrypt.hash(userPassword, 12);

            await pool.query(authQuery.createUser, [userEmail, hashPassword, userNickname, nextId, nextId]);

            return {
                status: '003',
                message: '가입에 성공하였습니다.'
            };
        }
    } catch (err) {
        console.error(err);
        throw Error(err);
    }
};  