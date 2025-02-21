/**
 * @author Arsen Grigoryan
 * @email grigoryan.arsen65@gmail.com
 * @date 21.02.2025
 */
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/**
 * @description Create a table in the database named User
 */
const User = sequelize.define("User", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    validate: {
      isEmailOrPhone(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!emailRegex.test(value) && !phoneRegex.test(value)) {
          throw new Error("ID must be a valid email or phone number");
        }
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
