const Sequelize = require('sequelize');

module.exports = class Board extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            start: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            topic: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            description: {
                type: Sequelize.STRING(400),
                allowNull: false
            },
            user_id: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            }
        },{
            sequelize,
            timestamps: false,
            paranode: false,
            underscored: true,
            modelName: 'Board',
            tableName: 'BOARD',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
    static associate(db) {
        db.Board.hasMany(db.Product, {foreignKey: 'board_id', sourceKey: 'id', onDelete: 'cascade'});
        db.Board.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id', });
    }
};