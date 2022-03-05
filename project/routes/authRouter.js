const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * 로그인
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        // 서버에러
        if (authError) {
            console.error(authError);
            return next(authError);
        }

        // 로그인 실패시
        if (!user) {
            return res.json({result: 'err'});   // [TODO] 에러페이지
        }

        // 로그인 성공시
        return req.login(user, (loginError) => {
            // 에러시
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }

            return res.json({result: 'suc'});   // [TODO] 에러페이지
        });

    })(req, res, next);
});

module.exports = router;