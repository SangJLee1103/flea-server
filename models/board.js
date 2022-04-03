const Sequelize = require('sequelize');

module.exports = class Board extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            start: {
                type: Sequelize.STRING(30)
            },

            nickname: {
                type: Sequelize.STRING(30),
                allowNull: false,
                uniqueKey: true
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            }
        },{
            sequelize,
            timestamps: false,
            paranode: false,
            underscored: false,
            modelName: 'Board',
            tableName: 'BOARD',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
    // static associate(db){
    //     db.User.hasMany(db.Pet, {foreignKey: 'userId', sourceKey: 'id', onDelete: 'cascade'});
    // }
};