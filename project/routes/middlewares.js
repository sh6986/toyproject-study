exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect(`/login`);
        // 전체요청 -> login 페이지 렌더링
        // axios요청 -> 에러코드 응답
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect(`/`);
    }
};