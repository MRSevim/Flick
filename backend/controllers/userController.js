const User = require("../models/userModel");
const { Article } = require("../models/articleModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");

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

/**
 * @description Function to decode Google OAuth token
 * @param token: string
 * @returns ticket object
 */
const getDecodedOAuthJwtGoogle = async (token, next) => {
  const CLIENT_ID_GOOGLE = process.env.GOOGLE_CLIENT_ID;

  try {
    const client = new OAuth2Client(CLIENT_ID_GOOGLE);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID_GOOGLE,
    });

    return ticket;
  } catch (error) {
    next(error);
  }
};

// login a user
const loginUser = async (req, res, next) => {
  const { username, password, isGoogleLogin, googleCredential } = req.body;

  try {
    if (!isGoogleLogin) {
      const user = await User.login(res, username, password);

      // create a token
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        username,
        isGoogleLogin: user.isGoogleLogin,
      });
    } else {
      const ticket = await getDecodedOAuthJwtGoogle(googleCredential, next);
      const { name, email } = ticket.getPayload();
      const user = await User.googleLogin(res, name, email);

      // create a token
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        username: name,
        isGoogleLogin: user.isGoogleLogin,
      });
    }
  } catch (error) {
    next(error);
  }
};

// signup a user
const signupUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(res, username, email, password);

    // create a token
    const token = generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      username,
      isGoogleLogin: user.isGoogleLogin,
    });
  } catch (error) {
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

//get Public User
const getPublicUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }
    const mostLikedArticles = await Article.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user._id),
          isDraft: false,
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
        },
      },
      {
        $sort: { likeCount: -1, createdAt: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      createdAt: user.createdAt,
      mostLikedArticles,
    });
  } catch (error) {
    next(error);
  }
};

// get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
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
    next(error);
  }
};

//update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const { username, email, password } = req.body;

    if (user) {
      if (user.isGoogleLogin) {
        res.status(400);
        throw new Error(
          "You cannot update values since you are logged in through Google"
        );
      }

      if (!username && !email && !password) {
        res.status(400);
        throw new Error("Please send something to update");
      }

      if (email && !validator.isEmail(email)) {
        res.status(400);
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
        res.status(400);
        throw new Error("Email and username are already in use");
      } else if (emailExists) {
        res.status(400);
        throw new Error("Email is already in use");
      } else if (usernameExists) {
        res.status(400);
        throw new Error("Username is already in use");
      }

      if (password && !validator.isStrongPassword(password)) {
        res.status(400);
        throw new Error("Password is not strong enough");
      }
      if (username && !validator.matches(username, "^[a-zA-Z0-9_.-]*$")) {
        res.status(400);
        throw new Error(
          "Username can only contain English letters (both uppercase and lowercase), numbers, underscores (_), dots (.), and hyphens (-)"
        );
      }

      user.username = username || user.username;
      user.email = email || user.email;

      if (password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isGoogleLogin: updatedUser.isGoogleLogin,
      });
    } else {
      res.status(404);
      throw new Error("User is not found");
    }
  } catch (error) {
    next(error);
  }
};

// delete user
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { password } = req.body;

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    if (!user.isGoogleLogin) {
      if (!password) {
        res.status(400);
        throw new Error("Please send a password");
      }
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        res.status(400);
        throw new Error("Incorrect password");
      }
    }

    await user.deleteOne();

    res.status(200).json({ id: user._id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getPublicUser,
};
