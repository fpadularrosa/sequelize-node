const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    sequelize.define('person', {
        personId: {
            type: DataTypes.UUID,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        age: {
            type: DataTypes.NUMBER,
            allowNull: false
        }
    },
    {
        timestamps: false
    })
};