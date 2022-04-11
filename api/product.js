const express = require('express');
const multer = require('multer');

const User = require('../models/user');
const Board = require('../models/board');
const Product = require('../models/product');
const { body } = require('express-validator');
const { validatorErrorChecker } = require('../middleware/validatorMiddleware');
const auth = require('../middleware/authMiddleware');
const {count} = require('../models/board');

const router = express.Router();


router.post('/join', auth,
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

module.exports = router;
