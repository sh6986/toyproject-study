const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const helmet = require('helmet');
const hpp = require('hpp');
const logger = require('./logger');
const pageRouter = require('./routes/pageRouter');
const userRouter = require('./routes/userRouter');
const recruitRouter = require('./routes/recruitRouter');
const manageRouter = require('./routes/manageRouter');
const authRouter = require('./routes/authRouter');
const passportConfig = require('./passport/index');
const cors = require('cors');
const app = express();
dotenv.config();
passportConfig();

app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,    // HTML 파일이 변경될 때에 템플릿 엔진을 reload
});

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(helmet({contentSecurityPolicy: false}));
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
};

if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = true; // nginx 같은 프록시서버 사용할 때 필요. 여기서는 사용하지 않지만 붙여줘도 문제x
    sessionOption.cookie.secure = true;
}

app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', pageRouter);
app.use('/user', userRouter);
app.use('/recruit', recruitRouter);
app.use('/manage', manageRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    logger.error(error.message);
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};
    res.status(err.status || 500).render('error', {page: 'error'});
});

app.listen(app.get('port'), () => {
    logger.info(`${app.get('port')}번 포트에서 대기중`);
});