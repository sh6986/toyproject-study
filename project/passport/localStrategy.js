const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const authQuery = require('../queries/authQuery');
const pool = require('../lib/db');

module.exports = () => {
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const result = await pool.query(authQuery.login, [email]);
            const user = result[0][0];

            // 사용자 존재하는지 확인
            if (user) {     // 시용자 존재할시
                // [TODO] 암호화 비밀번호 비교
                if (password === user.USER_PASSWORD) {  // 비밀번호 일치시
                    done(null, user);
                } else {                                // 비밀번호 불일치시
                    done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
                }
            } else {        // 사용자 존재하지 않을시
                done(null, false, {message: '가입되지 않은 회원입니다.'});
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
};

