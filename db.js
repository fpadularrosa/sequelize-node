require('dotenv').config();
const fs = require('fs');
const { Sequelize } = require('sequelize');
const path = require('path');
const mysql = require('mysql2')

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    hosts: 'localhost',
    dialect: 'mysql'
});

async function initialize() {
    try {
        const connection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        });
        connection.connect(err => {
            if (err) throw err;
            console.log('Connected to database');
        });
    } catch (error) {
        console.error(error)
    }
}
initialize();

const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
});


modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);
const { Person, Movie } = sequelize.models;

Person.belongsToMany(Movie, { through: 'person_movie', timestamps: false });
Movie.belongsToMany(Person, { through: 'person_movie', timestamps: false });

module.exports = {
    ...sequelize.models
}