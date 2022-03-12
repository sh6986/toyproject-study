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
        // [TODO] 상태랑 메세지 따로 정리, 관리 필요
        if (!user) {
            return res.json({
                status: '001',
                message: '로그인 실패'
            });
        }

        // 로그인 성공시
        return req.login(user, (loginError) => {
            // 에러시
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }

            // [TODO] 상태랑 메세지 따로 정리, 관리 필요
            return res.json({
                status: '002',
                message: '로그인 성공'
            });
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