const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Project = sequelize.define('Project', {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  tech: DataTypes.JSON,
  icon: DataTypes.STRING,
  image: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  },{
  timestamps: false,   // ✅ add this lin
});

module.exports = Project;