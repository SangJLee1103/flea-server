const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id: {
                type: Sequelize.STRING(20),
                allowNull: false,
                primaryKey: true
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            email:{
                type: Sequelize.STRING(50),
                allowNull: false,
                validate:{
                    isEmail: true
                },
                uniqueKey: true
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
            address: {
                type: Sequelize.STRING(50),
                allowNull: false
            }
        },{
            sequelize,
            timestamps: false,
            paranode: false,
            underscored: false,
            modelName: 'User',
            tableName: 'USER',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
    // static associate(db){
    //     db.User.hasMany(db.Pet, {foreignKey: 'userId', sourceKey: 'id', onDelete: 'cascade'});
    // }
};



