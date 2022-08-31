const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('movie', {
        movieId: {
            type: DataTypes.UUID,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        year: {
            type: DataTypes.NUMBER
        }
    },
    {
        timestamps: false
    })
}