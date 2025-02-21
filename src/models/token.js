/**
 * @author Arsen Grigoryan
 * @email grigoryan.arsen65@gmail
 * @date 21.02.2025
 */
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/**
 * @description Create a table in the database named Token
 */
const Token = sequelize.define("Token", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isValid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Token;
