const express = require('express');

const User = require('../models/user');
const { isLoggedIn, isNotLoggedIn } = require('./checklogin');
const { body } = require('express-validator');
const { validatorErrorChecker } = require('../middleware/validator');
const bcrypt = require('bcrypt');
const passport = require('passport');


const router = express.Router();

//회원가입
router.route('/join')
    .post(
        body("id").isLength({min: 8, max: 20}),
        body("email").isEmail(),
    
        async (req, res, next) => {
        const userData = req.body;
        console.log(userData);
        

        const userIdValidateion = await User.findOne({ where: { id: req.body.id }});
        if (userIdValidateion) {
            next('이미 등록된 아이디입니다.');
            return;
        }

        const userEmailValidation = await User.findOne({ where: { email: req.body.email }});
        if (userEmailValidation) {
            next('이미 등록된 메일입니다.');
            return;
        }

        const userPhoneValidation = await User.findOne({ where: { phone: req.body.phone }});
        if (userPhoneValidation) {
            next('이미 등록된 휴대폰 번호입니다.');
            return;
        }

        const userNicknameValidation = await User.findOne({ where: { nickname: req.body.nickname }});
        if (userNicknameValidation) {
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
            res.status(201).json({"message" : "회원가입이 완료되었습니다"});
        } catch (err) {
            console.log(err);
            next(err);
        }
    });



//로그인   
router.route('/login')
    .get( (req, res, next) => {
        try {
            res.render('login');
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .post( (req, res, next) => {
        console.log(req.body);

        passport.authenticate('local', (authError, user, info) => {
            if (user) {
                req.login(user, loginError => res.redirect('/'));
                res.locals.isAuthenticated = isLoggedIn;
            }
            else res.send(`${info.message}`);
        })(req, res, next);
    });

//로그아웃
router.get('/logout', (req, res, next) => {  
    try{
        req.logout();
        req.session.destroy();
        res.redirect('/');
    }catch(err){
        console.log(err);
        next(err);
    }
})


// 마이페이지
router.route('/mypage')
    .get ((req, res, next) => {
        try {
            res.locals.isAuthenticated = isLoggedIn; //로그인이 되었는지 안됬는지
            res.locals.user = req.user;
            res.render('mypage');
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    
    .post ( async (req, res, next) => {
        console.log(req.body);
        try {
            const hash = await bcrypt.hash(req.body.password, 12);
            const result = await User.update({
                password: hash,
                name: req.body.name,
                address: req.body.address
            }, {
                where: { id: req.body.id }
            });
            if (result) res.redirect('/');
            else next('Not updated!')
        } catch (err) {
            console.error(err);
            next(err);
        }
    });


module.exports = router;