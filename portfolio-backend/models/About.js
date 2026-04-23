const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const About = sequelize.define('About', {
  summary: DataTypes.TEXT,
  profilePhoto: DataTypes.STRING,
  heroPhoto: DataTypes.STRING,
  cv: DataTypes.STRING,
  education: DataTypes.JSON,
  experience: DataTypes.JSON,
  techStack: DataTypes.JSON,
  }, {
  timestamps: false,   // ✅ add this line
});

module.exports = About;