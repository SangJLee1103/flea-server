const Sequelize = require('sequelize');

module.exports = class Product_Image extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            file: {
                type: Sequelize.BLOB,
                allowNull: false
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            }   
        },{
            sequelize,
            timestamps: false,
            paranode: false,
            underscored: true,
            modelName: 'Product_Image',
            tableName: 'IMAGE',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
    static associate(db) {
        db.Product_Image.belongsTo(db.Product, { foreignKey: 'product_id', targetKey: 'id' });
    }
};