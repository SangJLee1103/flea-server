const jwt = require('jsonwebtoken');
require('dotenv').config();

const authToken = async(req, res, next) => {
    // 인증 완료
    
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log(token)
    if (!token) {
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.'
        });
    }

    try{
         // 요청 헤더에 저장된 토큰(token)과 비밀키를 사용하여 토큰을 req.decoded에 반환
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user.id;
        next()
    }catch(error){
        return res.status(419).json({
            code: 419,
            message: '토큰이 만료되었습니다.'
        });
    }
}

module.exports = authToken;