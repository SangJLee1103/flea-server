const express = require('express');

const User = require('../models/user');
const Board = require('../models/board');
const { body } = require('express-validator');
const { validatorErrorChecker } = require('../middleware/validatorMiddleware');
const auth = require('../middleware/authMiddleware');

const router = express.Router();


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

router.get('/writing/:id', auth, async(req, res, next) => {
        const user = await User.findOne({where: {id: req.user}});
        
        try {
            console.log(req.params);
            const findBoard = Board.findOne({where: {id: req.params.id}});
            res.status(200).json({find: findBoard});
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
);







module.exports = router;