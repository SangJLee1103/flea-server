const express = require('express');

const User = require('../models/user');
const Board = require('../models/board');
const { body } = require('express-validator');
const { validatorErrorChecker } = require('../middleware/validatorMiddleware');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authMiddleware');
const { count } = require('../models/user');

const router = express.Router();

//회원가입
router.post('/join',
        // 회원가입 데이터 유효성 검증
        body("id").trim().notEmpty().withMessage("공백불가!").matches(/^[a-z]+[a-z0-9]{5,19}$/).withMessage("아이디는 최소 6자리 최대 20자리입니다."),
        body("password").trim().notEmpty().withMessage("공백불가!").matches(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/).withMessage("비밀번호는 8~ 20 자리이고 대소문자 또는 특수기호를 최소 1자 이상 사용해야 합니다."),
        body("email").trim().notEmpty().withMessage("공백불가!").isEmail().withMessage("이메일 형식이어야 합니다."),
        body("phone").trim().notEmpty().withMessage("공백불가!").isMobilePhone().matches(/^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/).withMessage("휴대폰 번호 형식이어야합니다."),
        body("nickname").trim().notEmpty().withMessage("공백불가!").isLength({min: 1, max: 30}).withMessage("닉네임은 15자리 이하입니다."),
        body("address").isLength({min: 2, max: 50}).withMessage("주소를 간단하게라도 입력해주세요.(ex.서울특별시 강남구)"),
        validatorErrorChecker, 
        async (req, res, next) => {
            //회원 중복 체크
            const userIdDuplication = await User.findOne({ where: { id: req.body.id }});
            if (userIdDuplication) {
                next('이미 등록된 아이디입니다.');
                return;
            }

            const userEmailDuplication = await User.findOne({ where: { email: req.body.email }});
            if (userEmailDuplication) {
                next('이미 등록된 메일입니다.');
                return;
            }

            const userPhoneDuplication = await User.findOne({ where: { phone: req.body.phone }});
            if (userPhoneDuplication) {
                next('이미 등록된 휴대폰 번호입니다.');
                return;
            }

            const userNicknameDuplication = await User.findOne({ where: { nickname: req.body.nickname }});
            if (userNicknameDuplication) {
                next('이미 등록된 닉네임입니다.');
                return;
            }

            try {
                const hash = await bcrypt.hash(req.body.password, 12);
                await User.create({
                    id: req.body.id,
                    password: hash,
                    email: req.body.email,
                    phone: req.body.phone,
                    nickname: req.body.nickname,
                    address: req.body.address,
                });
                res.status(201).json({message : "회원가입이 완료되었습니다😁"});
            } catch (err) {
                console.log(err);
                next(err);
            }
    });

//로그인   
router.post('/login', async(req, res, next) => {
        const { id, password } = req.body;

        const loginUser = await User.findOne({where: {id}}).catch((err) => {
            console.log("Error: ", err);
        });

        //아이디 또는 비밀번호가 틀린 경우
        if(!loginUser){
            return res.status(401).json({message : "존재하지 않는 계정입니다."});
        }

        const ValidPassword = await bcrypt.compare(password, loginUser.password);

        if(!ValidPassword){
            return res.status(401).json({message : "비밀번호가 일치하지 않습니다."});
        }
        
        //토큰 서명 부분
        const accessToken = jwt.sign(
            {
                id: loginUser.id, 
                exp: Math.floor(Date.now() / 1000) + 60 * 60, //access_token 1시간
            }, 
            process.env.JWT_ACCESS_SECRET 
        );
        
        const refreshToken = jwt.sign(
            {
                id: loginUser.id, 
                exp: Math.floor(Date.now() / 1000) + 86400 * 180, //refresh_token 6개월
            }, 
            process.env.JWT_REFRESH_SECRET
        );
        
        
        //로그인 성공시 응답객체
        res.json({message: "환영합니다! 😁" + loginUser.nickname + "님", accessToken: accessToken, refreshToken: refreshToken});;
    }
);

// //로그아웃
// router.get('/logout', (req, res, next) => {  
//     try{
//         req.logout();
//         req.session.destroy();
//         res.redirect('/');
//     }catch(err){
//         console.log(err);
//         next(err);
//     }
// });

//회원 정보 불러오기
router.get('/info', auth, async(req, res, next) => {
    try {
        const userInfo = await User.findAll({
            where: {id: req.user},
            include: {
                model: Board
            }
        });
    res.status(200).json({list: userInfo});    
    } catch (err) {
        console.log(err);
        next(err);
    }    
    }
);

// 회원정보 수정
router.put('/update', auth, 
    body("id").trim().notEmpty().withMessage("공백불가!").matches(/^[a-z]+[a-z0-9]{5,19}$/).withMessage("아이디는 최소 6자리 최대 20자리입니다."),
    body("password").trim().notEmpty().withMessage("공백불가!").matches(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/).withMessage("비밀번호는 8~ 20 자리이고 대소문자 또는 특수기호를 최소 1자 이상 사용해야 합니다."),
    body("email").trim().notEmpty().withMessage("공백불가!").isEmail().withMessage("이메일 형식이어야 합니다."),
    body("phone").trim().notEmpty().withMessage("공백불가!").isMobilePhone().matches(/^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/).withMessage("휴대폰 번호 형식이어야합니다."),
    body("nickname").trim().notEmpty().withMessage("공백불가!").isLength({min: 1, max: 30}).withMessage("닉네임은 15자리 이하입니다."),
    body("address").isLength({min: 2, max: 50}).withMessage("주소를 간단하게라도 입력해주세요.(ex.서울특별시 강남구)"),
    validatorErrorChecker, async(req, res, next) => {
        const userEmailDuplication = await User.findAll({ where: { email: req.body.email }});
        if (count(userEmailDuplication) == 2) {
            next('이미 등록된 메일입니다.');
            return;
        }

        const userPhoneDuplication = await User.findAll({ where: { phone: req.body.phone }});
        if (count(userPhoneDuplication) == 2) {
            next('이미 등록된 휴대폰 번호입니다.');
            return;
        }

        const userNicknameDuplication = await User.findAll({ where: { nickname: req.body.nickname }});
        if (count(userNicknameDuplication) == 2) {
            next('이미 등록된 닉네임입니다.');
            return;
        }
        try {
            const hash = await bcrypt.hash(req.body.password, 12);
            const result = await User.update({
                password: hash,
                email: req.body.email,
                phone: req.body.phone,
                nickname: req.body.nickname,
                address: req.body.address,
            }, {
                where: { id: req.body.id }
            });

            if(result){
                res.status(201).json({message : "수정 완료"});
            }else{
                res.status(401).json({message : "인증 되지 않은 사용자"});
            }

        } catch (err) {
            console.error(err);
            next(err);
        }
    }
);

module.exports = router;