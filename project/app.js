const express = require('express');
const morgan = require('morgan');
const path = require('path');
const nunjucks = require('nunjucks');
const pageRouter = require('./routes/page');
const userRouter = require('./routes/user');
const recruitRouter = require('./routes/recruit');
const app = express();

app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,    // HTML 파일이 변경될 때에 템플릿 엔진을 reload
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', pageRouter);
app.use('/user', userRouter);
app.use('/recruit', recruitRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};
    res.status(err.status || 500).render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});