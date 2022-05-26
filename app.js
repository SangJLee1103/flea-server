const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('dotenv').config();

const {sequelize} = require('./models');
// const passport = require('passport');
// const passportConfig= require('./passport');
// passportConfig();

// require("./passport/local");

const memberRouter = require('./api/member');
const boardRouter = require('./api/board');
const productRouter = require('./api/product');
const likesRouter = require('./api/likes');


const app = express();
app.set('port', process.env.PORT || 3000);

sequelize.sync({ force: false })
    .then(() => console.log("DB 연결 성공"))
    .catch(err => console.error(err));

app.use(
    morgan('dev'), //요청이 왔을 때 log를 찍어줌
    express.json(), // json 내용을 분석
    express.urlencoded({extended: false}), //url 파싱
    cookieParser(process.env.SECRET), //쿠키(매개변수로 비밀키)
    session({
        resave: false,
        saveUninitialized: false,
        secret:process.env.SECRET,
        cookie:{
            httpOnly: true,
            secure: false
        },
        name: 'session-cookie'
    }),
    // passport.initialize(),
    // passport.session()
);

app.use('/uploads', express.static('uploads'));
app.use('/member', memberRouter);
app.use('/board', boardRouter);
app.use('/product', productRouter);
app.use('/likes', likesRouter);

app.use((req, res, next) => {
    console.log('404');
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next();
});

app.use((err, req, res, next) => { //에러 처리 미들웨어, 매개변수가 4개!!!, 맨 마지막에 있는 것이 안정적이고 좋음
    console.error(err);
    res.status(403).json({message : err});
});

app.listen(app.get('port'), () => console.log(app.get('port'), '번 포트에서 대기 중'));

module.exports = app;
