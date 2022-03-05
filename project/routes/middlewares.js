exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect(`/login`);
        // next() 가 없으므로 다음으로 안넘어가고 여기서 끝난다.
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect(`/`);
    }
};