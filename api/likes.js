const express = require('express');

const Likes = require('../models/likes');
const User = require('../models/user');
const Product = require('../models/product');
const auth = require('../middleware/authMiddleware');

const router = express.Router();


// 특정 회원의 좋아요 조회
router.get("/read", auth, async (req, res, next) => {
        try {          
            const user = await User.findOne({where: {id: req.user} });
            const userLikes = await Likes.findAll({where: { user_id: user.id }});
            res.status(200).json({userLikes});
        }catch (err){
            console.log(err);
            next(err);
        }
    });

// 상품 좋아요 카운트 API
router.route("/:id/count")
    .post(auth, 
        async (req, res, next) => {
            try {
                const product = await Product.findOne({ where: { id: req.params.id } });
                const user = await User.findOne({ where: { id: req.user } }); //로그인 한 유저의 닉네임을 찾음

                const count = await Likes.create({
                    user_id: user.id,
                    product_id: product.id
                });
                res.status(200);
            }catch (err){
                console.log(err);
                next(err);
            }
        }
    )
    .delete(auth,
        async (req, res, next) => {
            try {
                const product = await Product.findOne({ where: { id: req.params.id } });
                const user = await User.findOne({ where: { id: req.user } }); //로그인 한 유저의 닉네임을 찾음
                const deleteLike = await Likes.findOne({
                    where: {
                        user_id: user.id,
                        product_id: product.id
                    }
                });
                const count = await deleteLike.destroy();
                res.status(200);
            }catch (err){
                console.log(err);
                next(err);
            }
        }
    )
    

module.exports = router;