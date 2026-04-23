const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('portfolio_db', 'root', 'your_mysql_password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;