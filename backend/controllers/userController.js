const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  return token;
};

// login a user
const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);

    // create a token
    const token = generateToken(res, user._id);

    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// signup a user
const signupUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(username, email, password);

    // create a token
    const token = generateToken(res, user._id);

    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// logout user
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("User is not found");
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

//update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { username, email, password } = req.body;

    if (user) {
      if (!username && !email && !password) {
        throw new Error("Please send some value/values to update");
      }

      if (email && !validator.isEmail(email)) {
        throw new Error("Email is not valid");
      }

      let emailExists, usernameExists;

      if (email) {
        emailExists = await User.findOne({ email });
      }
      if (username) {
        usernameExists = await User.findOne({ username });
      }

      if (emailExists && usernameExists) {
        throw new Error("Email and username are already in use");
      } else if (emailExists) {
        throw new Error("Email is already in use");
      } else if (usernameExists) {
        throw new Error("Username is already in use");
      }

      if (password && !validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
      }

      user.username = username || user.username;
      user.email = email || user.email;

      if (password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      });
    } else {
      res.status(404);
      throw new Error("User is not found");
    }
  } catch (error) {
    res.status(400);
    next(error);
  }
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};