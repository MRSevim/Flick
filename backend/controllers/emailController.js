const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { generateVerificationToken, sendEmail } = require("../helpers");

const verifyEmail = async (req, res, next) => {
  try {
    const token = req.params.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
      if (user.isVerified) {
        res.status(400);
        throw new Error("User has already been verified");
      }
      user.isVerified = true;
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        message: "User has been verified. You can now login",
      });
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (error) {
    next(error);
  }
};

const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("There is no user with that email");
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error("User is already verified");
    }
    if (user.isGoogleLogin) {
      res.status(400);
      throw new Error("Google accounts do not need to verify");
    }

    const token = generateVerificationToken(user._id);

    await sendEmail("signup-verification", email, user.username, token, next);

    res.status(200).json({
      message: "A verification email has been resent to your account",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyEmail, resendVerificationEmail };
