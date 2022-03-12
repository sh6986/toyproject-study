const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const authController = require('../controllers/authController');
const router = express.Router();

/**
 * 로그인
 */
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        // 서버에러
        if (authError) {
            console.error(authError);
            return next(authError);
        }

        // 로그인 실패시
        if (!user) {
            return res.json({});   // [TODO] 에러페이지
        }

        // 로그인 성공시
        return req.login(user, (loginError) => {
            // 에러시
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }

            return res.json({});   // [TODO] 에러페이지
        });

    })(req, res, next);
});

/**
 * 로그아웃
 */
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

/**
 * 회원가입
 */
router.post('/join', isNotLoggedIn, authController.createUser);

module.exports = router;