/**
 * @author Arsen Grigoryan
 * @email grigoryan.arsen65@gmail.com
 * @date 21.02.2025
 */
const { Sequelize } = require("sequelize");

/**
 * @description Create a connection to the database
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;
