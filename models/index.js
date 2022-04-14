const Sequelize = require('sequelize');

const User = require('./user');
const Board = require('./board');
const Product = require('./product');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize; //첫번째 코드 모듈 자체를 전달

db.User = User;
db.Board = Board;
db.Product = Product;

User.init(sequelize);
Board.init(sequelize);
Product.init(sequelize);

User.associate(db);
Board.associate(db);
Product.associate(db);

module.exports = db;