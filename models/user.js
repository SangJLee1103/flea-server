const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id: {
                type: Sequelize.STRING(40),
                allowNull: false,
                primaryKey: true,
                validate:{
                    isEmail: true
                },
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            phone:{
                type: Sequelize.STRING(15),
                allowNull: false,
                uniqueKey: true
            },
            nickname: {
                type: Sequelize.STRING(30),
                allowNull: false,
                uniqueKey: true
            },
        },{
            sequelize,
            timestamps: false,
            paranode: false,
            underscored: true,
            modelName: 'User',
            tableName: 'USER',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
    static associate(db){
        db.User.hasMany(db.Likes, {foreignKey: 'user_id', sourceKey: 'id', onDelete: 'cascade'});
        db.User.hasMany(db.Board, {foreignKey: 'user_id', sourceKey: 'id', onDelete: 'cascade'});
        db.User.hasMany(db.Product, {foreignKey: 'user_id', sourceKey: 'id', onDelete: 'cascade'});
    }
};
