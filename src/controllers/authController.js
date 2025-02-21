/**
 * @author Arsen Grigoryan
 * @email grigoryan.arsen65@gmail
 * @date 21.02.2025
 */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Token = require("../models/token");

/**
 * @description       Generate a new access token and a new refresh token
 * @param {string}    userId - The user id
 * @returns {object}  An object containing the access token and the refresh token. {accessToken, refreshToken}
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET);
  return { accessToken, refreshToken };
};

/**
 * @description       Register a new user and return the access token and the refresh token
 * @param {object}    req - The request object. It contains the user id and the password. { id, password }
 * @returns {object}  An object containing the access token and the refresh token. {accessToken}
 */
exports.signup = async (req, res) => {
  try {
    const { id, password } = req.body;

    const existingUser = await User.findByPk(id);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ id, password: hashedPassword });
    const { accessToken, refreshToken } = generateTokens(user.id);
    await Token.create({ userId: user.id, refreshToken });

    // Set refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @description       Sign in a user and return the access token and the refresh token
 * @param {object}    req - The request object. It contains the user id and the password. { id, password }
 * @returns {object}  An object containing the access token and the refresh token. {accessToken, refreshToken}
 */
exports.signin = async (req, res) => {
  try {
    const { id, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    await Token.create({ userId: user.id, refreshToken });

    // Set refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @description       Generate a new access token and a new refresh token
 * @param {object}    req - The request object. It contains the refresh token. { refreshToken }
 * @returns {object}  An object containing the access token and the refresh token. {accessToken, refreshToken}
 */
exports.newToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const token = await Token.findOne({
      where: { refreshToken, isValid: true },
    });

    if (!token) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.id
    );

    // Update refresh token
    await Token.update({ isValid: false }, { where: { refreshToken } });
    await Token.create({ userId: decoded.id, refreshToken: newRefreshToken });

    // Set new refresh token in HttpOnly cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @description       Log out a user
 * @returns {object}  An object containing the message. {message: "Logged out successfully"}
 */
exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ error: "Access token is required" });
    }

    // Get the refresh token from the request
    const refreshToken = req.refreshToken; // Get from middleware

    // Invalidate the specific refresh token
    await Token.update({ isValid: false }, { where: { refreshToken } });

    // Clear the refresh token cookie
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @description       Get user info
 * @returns {object}  An object containing the user id. {id}
 */
exports.info = async (req, res) => {
  res.json({ id: req.user.id });
};
