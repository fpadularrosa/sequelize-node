const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Movies', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false
    })
}