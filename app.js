const express = require('express');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const { getPerson, getMovie } = require('./controllers');
const { sequelize } = require('./db');

app.use(express.json());
app.use(morgan('dev'));

app.get('/person', getPerson);
app.get('/movie', getMovie);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Listening on port 3000');
});

 (async () => {
  await sequelize.sync({ force: false })
  .then(() => {
    console.log('DB synced');
  }
 )})();