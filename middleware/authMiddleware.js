const jwt = require('jsonwebtoken');
require('dotenv').config();

const authToken = async(req, res, next) => {
    // 인증 완료
    
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    //토큰이 만료되거나 틀릴 경우
    try{
        const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = user.id;
        next();
    }catch(error){
        if(error.name === 'TokenExpiredError'){
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.'
            })
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않는 토큰입니다.'
        });
    }
}

module.exports = authToken;
