/**
 * @author Arsen Grigoryan
 * @email grigoryan.arsen65@gmail
 * @date 21.02.2025
 */
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs").promises;
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

const sequelize = require("./config/database");

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5680;

async function startServer() {
  try {
    await sequelize.sync();
    console.log("Database synchronized successfully");
    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}`);
    });
  } catch (e) {
    console.log("Unable to start server:", e);
  }
}

startServer();
