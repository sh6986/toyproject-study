const logger = require('../logger');
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const authQuery = require('../queries/authQuery');
const authService = require('../services/authService');
const pool = require('../lib/db');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        
        try {
            // 사용자 존재하는지 확인
            const result = await pool.query(authQuery.kakaoLogin, [profile.id]);
            const exUser = result[0][0];

            if (exUser) {     // 사용자 존재할시
                done(null, exUser);    
            } else {        // 사용자 존재하지 않을시 가입하기
                const newUser = {
                    userEmail: profile._json && profile._json.kakao_account.email,
                    userNickname: profile.displayName, 
                    snsId: profile.id
                };

                const user = {};
                const userId = await authService.createKaKaoUser(newUser);
                user.USER_ID = userId;

                done(null, user);
            }   
        } catch (err) {
            logger.error(err);
            done(err);
        }
    }));
};