/**
 * @author Arsen Grigoryan
 * @email grigoryan.arsen65@gmail.com
 * @date 21.02.2025
 */
const jwt = require("jsonwebtoken");
const Token = require("../models/token");

/**
 * @description       Middleware function to authenticate a user
 * @returns {object}  An object containing the user id. {id}
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ error: "Access token is required" });
    }

    // Get refresh token from cookies
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const validToken = await Token.findOne({
      where: {
        userId: decoded.id,
        refreshToken: refreshToken,
        isValid: true,
      },
    });

    if (!validToken) {
      return res.status(401).json({ error: "Token is no longer valid" });
    }

    req.user = decoded;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = { authenticateToken };
