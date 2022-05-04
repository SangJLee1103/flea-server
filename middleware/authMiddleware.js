const jwt = require('jsonwebtoken');
require('dotenv').config();

const authToken = async (req, res, next) => {
    // 인증 완료

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    //토큰이 만료되거나 틀릴 경우
    try {
        const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = user.id;
        next();
    } catch (error) {
        //error 객체 생성
        var errorObj = {
            tokenExpired: {
                code: 419,
                msg: '토큰이 만료되었습니다.'
            },
            another: {
                code: 401,
                msg: '유효하지 않은 토큰입니다.'
            }
        }

        if (error.name === 'TokenExpiredError') {
            code = errorObj.tokenExpired.code,
            msg = errorObj.tokenExpired.msg
        } else {
            code = errorObj.another.code
            msg = errorObj.another.msg
        }

        return res.status(code).json({
            code: code,
            message: msg
        });
    }
}

module.exports = authToken;
