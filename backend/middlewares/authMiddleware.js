const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
const envVariables = require("../envVariables");

const protect = async (req, res, next) => {
  try {
    let token;

    token = req.cookies.jwt;

    if (token) {
      const decoded = jwt.verify(token, envVariables.jwtSecret);

      req.user = await User.findById(decoded.userId).select("-password");
      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
