const Sequelize = require('sequelize');

module.exports = class Likes extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            user_id: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            }
        },{
            sequelize,
            timestamps: false,
            paranode: false,
            underscored: true,
            modelName: 'Likes',
            tableName: 'LIKES',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
    static associate(db) {
        db.Likes.belongsTo(db.User, {foreignKey: 'user_id', targetKey: 'id'});
        db.Likes.belongsTo(db.Product, {foreignKey: 'product_id', targetKey: 'id'});
    }
};