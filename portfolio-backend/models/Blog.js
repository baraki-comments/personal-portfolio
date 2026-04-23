const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Blog = sequelize.define('Blog', {
  title: DataTypes.STRING,
  excerpt: DataTypes.TEXT,
  content: DataTypes.TEXT,
  tags: DataTypes.JSON,
  image: DataTypes.STRING,
  author: DataTypes.STRING,
  date: DataTypes.DATEONLY,
  },{
  timestamps: false,   // ✅ add this lin
});

module.exports = Blog;