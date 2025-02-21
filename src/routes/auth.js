/**
 * @author Arsen Grigoryan
 * @email grigoryan.arsen65@gmail.com
 * @date 21.02.2025
 */
const express = require("express");
const { body } = require("express-validator"); // body is a middleware for validating request body
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router(); // router is an instance of express router

router.post(
  "/signup",
  [body("id").notEmpty(), body("password").isLength({ min: 6 })], // id must not be empty, password must be at least 6 characters
  authController.signup
);

router.post("/signin", authController.signin);
router.get("/signin/new_token", authController.newToken);
router.get("/info", authenticateToken, authController.info); // authenticateToken is a middleware to check if the user is logged in
router.get("/logout", authenticateToken, authController.logout);

module.exports = router; // module.exports is a function to export the router. what is module in here? it's a global variable in Node.js to hold information about the current module
