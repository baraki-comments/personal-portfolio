const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Message = sequelize.define('Message', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  message: DataTypes.TEXT,
  date: DataTypes.DATEONLY,
  },{
  timestamps: false,   // ✅ add this lin
});

module.exports = Message;