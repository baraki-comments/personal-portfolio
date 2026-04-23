const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Skill = sequelize.define('Skill', {
  category: DataTypes.STRING,
  name: DataTypes.STRING,
  level: DataTypes.INTEGER,
},{
  timestamps: false,   // ✅ add this line
});

module.exports = Skill;