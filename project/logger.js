const {createLogger, format, transports, transport} = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        new transports.File({filename: 'combined.log'}),
        new transports.File({filename: 'error.log', level: 'error'})
    ],
});

// console.log
// console.info
// console.warn
// console.error
// level 을 info 로 주면 info 아래 3개종류 로그는 기록이 됨

// 개발용일때는 그냥 콘솔에 표시
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({format: format.simple()}));
}

module.exports = logger;