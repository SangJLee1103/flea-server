const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { QueryTypes } = require('sequelize');
const auth = require('../middleware/authMiddleware');
const { validatorErrorChecker } = require('../middleware/validatorMiddleware');

const User = require('../models/user');
const Board = require('../models/board');
const Product = require('../models/product');
const Likes = require('../models/likes');
const { sequelize } = require('../models/product');
const { body } = require('express-validator');

const router = express.Router();

fs.readdir('uploads', error => {
    if (error) {
        console.error('폴더 생성')
        fs.mkdirSync('uploads') //폴더 생성
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
});


//상품 등록 API
router.post('/:id/register', auth, upload.array('img', 5),
    body("name").notEmpty().withMessage("상품명은 필수입니다."),
    body("selling_price").notEmpty().withMessage("상품의 판매가격은 필수입니다.").isNumeric().withMessage("판매 가격은 숫자이어야 합니다."),
    body("cost_price").notEmpty().withMessage("상품의 시가는 필수입니다.").isNumeric().withMessage("시가는 숫자이어야 합니다."),
    body("description").notEmpty().withMessage("내용은 필수입니다."),
    validatorErrorChecker,
    async (req, res, next) => {
        try {
            const user = await User.findOne({ where: { id: req.user } }); // 로그인 한 회원 찾기
            const board = await Board.findOne({ where: { id: req.params.id } }); // 해당 게시글 찾기
            const image = req.files;
            const path = image.map(img => img.path);

            await Product.create({
                name: req.body.name,
                selling_price: req.body.selling_price,
                cost_price: req.body.cost_price,
                description: req.body.description,
                board_id: board.id,
                user_id: user.id,
                created_at: req.body.created_at,
                img: path.toString() // 이미지 경로 배열을 문자열로 변환

            });
            res.status(201).json({ message: "상품 등록 완료되었습니다.📚" });
        } catch (err) {
            console.log(err);
            next(err);
        }
    });

//상품 수정, 삭제, 조회 API
router.route('/:id')
    .put(
        body("name").notEmpty().withMessage("제목은 필수입니다."),
        body("selling_price").notEmpty().withMessage("상품의 판매가격은 필수입니다.").isNumeric().withMessage("판매 가격은 숫자이어야 합니다."),
        body("cost_price").notEmpty().withMessage("상품의 시가는 필수입니다.").isNumeric().withMessage("시가는 숫자이어야 합니다."),
        body("description").notEmpty().withMessage("내용은 필수입니다."),
        validatorErrorChecker,  auth, upload.array('img', 5),
        async (req, res, next) => {
            try {
                const product = await Product.findOne({ where: { id: req.params.id } });

                const image = req.files;
                const path = image.map(img => img.path);
                // const toModifiedProduct = await Product.findOne({ where: { id: product.id } });

                await product.update({
                    name: req.body.name,
                    selling_price: req.body.selling_price,
                    cost_price: req.body.cost_price,
                    description: req.body.description,
                    created_at: req.body.created_at,
                    img: path.toString() //이미지 경로 배열을 문자열로 변환
                });
                res.status(201).json({ message: "상품 정보가 수정되었습니다.🔄" });
            } catch (err) {
                console.log(err);
                next(err);
            }
        }
    )
    .delete(auth,
        async (req, res, next) => {
            try {
                const product = await Product.destroy({ where: { id: req.params.id } });
                res.status(200).json({ message: "상품이 삭제되었습니다.🚮" });
            } catch (err) {
                console.log(err);
                next(err);
            }
        }
    )
    .get(auth,
        async (req, res, next) => {
            try {
                const product = await Product.findOne({ 
                    where: { id: req.params.id },
                    include: {
                        model: Likes,
                        attributes: ['user_id']
                    }
                    
                });
                res.status(200).json({ data: product });
            } catch (err) {
                console.log(err);
                next(err);
            }
        }
    );

//하나의 게시글에 있는 모든 상품 조회 API
router.get('/:board_id/all', auth, async (req, res, next) => {
    try {
        const user = await User.findOne({where: {id: req.user} });
        const product = await Product.findAll({
            where: { board_id: req.params.board_id },
            include: [
                {
                    model: User,
                    attributes: ['nickname'],
                },
                {
                    model: Likes,
                    where: { user_id: user.id },
                    attributes: ['product_id'],
                    limit: 1 
                }
            ]
        });
        res.status(200).json({ data: product });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

//하나의 게시글에 있는 상품을 좋아요 순서대로 10개까지 조회하는 API(랭킹 기능)
router.get('/:board_id/popular', async (req, res, next) => {
    try {
        const top10 = []

        const data = await sequelize.query(
            'SELECT l.product_id, p.img, p.board_id, p.selling_price, u.nickname, COUNT(l.product_id) AS likesCount FROM product AS p'+
            ' INNER JOIN likes AS l on p.id = l.product_id'+
            ' INNER JOIN user AS u on u.id = p.user_id' +
            ' WHERE p.id = l.product_id'+
            ' GROUP BY l.product_id'+
            ' ORDER BY likesCount DESC LIMIT 10;',{
            type: QueryTypes.SELECT
        });

        data.forEach( e => {
            if(e.board_id == req.params.board_id) {
                top10.push(e);
            }
        })
        res.status(200).json({data: top10});
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;
