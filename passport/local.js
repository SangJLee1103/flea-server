const passport = require('passport');
const passportJwt = require('passport-jwt');
const  bcrypt = require('bcrypt');
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const User = require('../models/user');


passport.use(
    new StrategyJwt({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken, 
        secretOrKey: process.env.JWT_SECRET,
    }, 
    function (jwtPayload, done) {
        return User.findOne({where: {id: jwtPayload.id}})
            .then((user) => {
                return done(null, user);
            })
            .catch((err) => {
                return done(err);
            });
    }
    )
);


// module.exports = () => {
//     passport.use(new Strategy({
//         usernameField: 'id',
//         passwordField: 'password'
//     }, async (id, password, done) => {
//         try{
//             const user = await User.findOne({where: { id }});
//             if(user){
//                 const result = await bcrypt.compare(password, user.password);
//                 if(result)
//                     done(null, user);
//                 else
//                     done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
//             }else{
//                 done(null, false, {message: '가입되지 않은 아이디입니다.'});
//             }
//         }catch(error){
//             done(error);
//         }
//     }))
// };