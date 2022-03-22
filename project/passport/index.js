const logger = require('../logger');
const passport = require('passport');
const pool = require('../lib/db');
const authQuery = require('../queries/authQuery');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.USER_ID);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const result = await pool.query(authQuery.getUser, [id]);
            const user = result[0][0];
            
            done(null, user);
        } catch (err) {
            logger.error(err);
            done(err);
        }
    });

    local();
    kakao();
};

