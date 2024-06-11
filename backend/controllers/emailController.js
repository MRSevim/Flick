const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { generateVerificationToken, sendEmail } = require("../helpers");
const crypto = require("crypto");
const envVariables = require("../envVariables");

const verifyEmail = async (req, res, next) => {
  try {
    const token = req.params.token;

    if (token) {
      const decoded = jwt.verify(token, envVariables.jwtSecret);
      const user = await User.findById(decoded.userId);

      if (!user) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
      if (user.isVerified && user.newEmail === "") {
        res.status(400);
        throw new Error("Your email has already been verified");
      }
      user.isVerified = true;
      if (user.newEmail) {
        user.email = user.newEmail;
        user.newEmail = "";
      }
      await sendEmail("verified", user.email, user.username, next);

      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        message: "Email has been verified",
      });
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (error) {
    next(error);
  }
};

const sendResetPasswordEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      res.status(404);
      throw new Error("Please send an email");
    }

    const user = await User.findOne({
      email,
      isGoogleLogin: false,
    });

    if (!user) {
      res.status(404);
      throw new Error(
        "There is no user with that email or User is google user and does not need password to log in"
      );
    }
    const passwordBytes = crypto.randomBytes(16);
    const password = passwordBytes.toString("base64").slice(0, 16);

    user.password = password;

    await user.save();

    await sendEmail("password-reset", email, user.username, next, {
      password,
    });

    res.status(200).json({
      message: "Password reset email has been sent to your account",
    });
  } catch (error) {
    next(error);
  }
};

const sendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      res.status(404);
      throw new Error("Please send an email");
    }
    const user = await User.findOne({
      $or: [
        { email, isGoogleLogin: false },
        { newEmail: email, isGoogleLogin: false },
      ],
    });

    if (!user) {
      res.status(404);
      throw new Error(
        "There is no user with that email or User is google user and does not require verification"
      );
    }

    if (user.isVerified && user.newEmail === "") {
      res.status(400);
      throw new Error("Your email has already been verified");
    }

    const token = generateVerificationToken(user._id);

    await sendEmail("email-verification", email, user.username, next, {
      token,
    });

    res.status(200).json({
      message: "A verification email has been sent to your account",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyEmail, sendVerificationEmail, sendResetPasswordEmail };
