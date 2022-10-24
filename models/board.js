const Sequelize = require('sequelize');

module.exports = class Board extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            thumbnail: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            topic: {   // 주제
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            place: {    // 장소
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            start: {   // 날짜
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            description: {  // 내용
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            user_id: {  // 올린사람 ID
                type: Sequelize.STRING(40),
                allowNull: false,
            },
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
        db.Board.hasMany(db.Product, {foreignKey: 'board_id', sourceKey: 'id', onDelete: 'cascade'}, {foreignKey: 'board_title', sourceKey: 'topic'});
        db.Board.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id', });
    }
};
