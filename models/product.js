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
                validate:{
                    isInt: true
                },
            },
            selling_price:{
                type: Sequelize.INTEGER,
                allowNull: false,
                validate:{
                    isInt: true
                },
            },
            like_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate:{
                    isInt: true
                },
            },
            description: {
                type: Sequelize.STRING(400),
                allowNull: false
            },
            board_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            nickname: {
                type: Sequelize.STRING(30),
                allowNull: false
            },
            img: {
                type: Sequelize.STRING(400),
                allowNull: false
            }

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
        db.Product.belongsTo(db.User, {foreignKey: 'nickname', targetKey: 'nickname'});
        db.Product.belongsTo(db.Board, {foreignKey: 'board_id', targetKey: 'id'});
    }
};



