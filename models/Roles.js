const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Roles', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        roleName: {
            type: DataTypes.ENUM({
                values: ['director', 'actor', 'producer']
            }),
            defaultValue: 'actor'
        }
    },
    {
        timestamps: false
    })
}