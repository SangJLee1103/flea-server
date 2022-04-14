// const express = require('express');
// const multer = require('multer');

// const User = require('../models/user');
// const Board = require('../models/board');
// const Product = require('../models/product');
// const { body } = require('express-validator');
// const { validatorErrorChecker } = require('../middleware/validatorMiddleware');
// const auth = require('../middleware/authMiddleware');

// const router = express.Router();


// router.route('/:id/register')
//     .get(auth,
//         async (req, res, next) => {
//             try {
//                 const user = await User.findOne({ where: { id: req.user } }); //로그인 한 회원 찾기
//                 const findBoard = await Board.findOne({ where: { nickname: user.nickname, id: req.params.id } });

//                 await Product.create({
//                     name: req.body.name,
//                     cost_price: req.body.cost_price,
//                     selling_price: req.body.selling_price,
//                     : findNickname.nickname,
//                     password: req.body.password //게시글 작성자에게 허가를 받은 사용자만 판매자가 될 수 있음(ex: 바자회)
//                 });
//                 res.status(201).json({ message: "상품 등록 완료되었습니다 ®" });
//             } catch (err) {
//                 console.log(err);
//                 next(err);
//             }
//         }
// );

// module.exports = router;
