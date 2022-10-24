const Sequelize = require('sequelize');

module.exports = class Product extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            name: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            cost_price:{
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            selling_price:{
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING(400),
                allowNull: false
            },
            board_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            board_title: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            user_id: {
                type: Sequelize.STRING(40),
                allowNull: false
            },
            img: {
                type: Sequelize.STRING(500),
                allowNull: false
            },
            created_at: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
        },{
            sequelize,
            timestamps: false,
            paranode: false,
            underscored: true,
            modelName: 'Product',
            tableName: 'PRODUCT',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
    static associate(db){
        db.Product.hasMany(db.Likes, {foreignKey: 'product_id', sourceKey: 'id', onDelete: 'cascade'});
        db.Product.belongsTo(db.User, {foreignKey: 'user_id', targetKey: 'id'});
        db.Product.belongsTo(db.Board, {foreignKey: 'board_id', targetKey: 'id'}, {foreignKey: 'board_title', targetKey: 'topic'});
        // db.product.belongsTo(db.Board, {foreignKey: 'board_title', targetKey: 'topic'});
    }
};
