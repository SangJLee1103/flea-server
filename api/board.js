const express = require('express');

const User = require('../models/user');
const Board = require('../models/board');
const { body } = require('express-validator');
const { validatorErrorChecker } = require('../middleware/validatorMiddleware');
const auth = require('../middleware/authMiddleware');
const {count} = require('../models/board');

const router = express.Router();


//게시글 작성 API
router.post('/write', auth,
    body("start").not().isEmpty().withMessage("날짜를 정해주세요!"),
    body("topic").isLength({ min: 10, max: 50 }).withMessage("10자 이상 50자 이하로 작성해주세요!"),
    body("description").isLength({ min: 20, max: 400 }).withMessage("20자 이상 400자 이하로 작성해주세요!"),
    validatorErrorChecker,
    async (req, res, next) => {
        const topicDuplication = await Board.findOne({ where: { topic: req.body.topic } });
        if (topicDuplication) {
            next("게시글 제목이 이미 존재합니다.");
            return
        }
        try {
            const findNickname = await User.findOne({ where: { id: req.user } }); //로그인 한 유저의 닉네임을 찾음

            await Board.create({
                start: req.body.start,
                topic: req.body.topic,
                description: req.body.description,
                nickname: findNickname.nickname,
                password: req.body.password //게시글 작성자에게 허가를 받은 사용자만 판매자가 될 수 있음(ex: 바자회)
            });
            res.status(201).json({ message: "작성 완료되었습니다✍🏻" });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
);

//로그인한 회원이 올린 게시글 단건 조회, 해당 게시글 수정 API
router.route('/update/:nickname/:id')
    .get(auth,
    async(req, res, next) => {
        try {
            const user = await User.findOne({where: {id: req.user}}); //로그인 한 회원 찾기
            const findBoard = await Board.findOne({where: {nickname: user.nickname, id: req.params.id}});
            console.log(findBoard);
            res.status(200).json({find: findBoard});
        } catch (err) {
            console.log(err);
            next(err);
        }
    })
    .put(auth, 
        body("start").not().isEmpty().withMessage("날짜를 정해주세요!"),
        body("topic").isLength({ min: 10, max: 50 }).withMessage("10자 이상 50자 이하로 작성해주세요!"),
        body("description").isLength({ min: 20, max: 400 }).withMessage("20자 이상 400자 이하로 작성해주세요!"),
        validatorErrorChecker,
        async(req, res, next) => {
            try {
                const topicDuplication = await Board.findOne({ where: { topic: req.body.topic } });
                if (count(topicDuplication)==2) {
                    next("게시글 제목이 이미 존재합니다.");
                    return
                }
                const user = await User.findOne({where: {id: req.user}}); //로그인 한 회원 찾기
                const findBoard = await Board.findOne({where: {nickname: user.nickname, id: req.params.id}});
                
                await findBoard.update({
                    start: req.body.start,
                    topic: req.body.topic,
                    description: req.body.description,
                    nickname: findBoard.nickname,
                    password: req.body.password //게시글 작성자에게 허가를 받은 사용자만 판매자가 될 수 있음(ex: 바자회)
                });
                res.status(201).json({ message: "수정 완료되었습니다✍🏻" });
            } catch (err) {
                console.log(err);
                next(err);
            }
        }
    );





module.exports = router;