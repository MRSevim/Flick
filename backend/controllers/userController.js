const User = require("../models/userModel");
const { Article, Like } = require("../models/articleModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const {
  generateToken,
  generateVerificationToken,
  sendEmail,
  getDecodedOAuthJwtGoogle,
} = require("../helpers");

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
        image: user.image,
      });
    } else {
      const ticket = await getDecodedOAuthJwtGoogle(googleCredential, next);
      const { picture, name, email } = ticket.getPayload();
      const user = await User.googleLogin(res, name, email, picture);

      // create a token
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        username: name,
        isGoogleLogin: user.isGoogleLogin,
        image: user.image,
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
    const token = generateVerificationToken(user._id);

    //send email
    await sendEmail("email-verification", email, username, token, next);

    res.status(201).json({
      message: "A verification email has been sent to your account",
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
    const user = await User.findOne({ _id: req.params.id });
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
      image: user.image,
      mostLikedArticles,
      followerNumber: user.followers.length,
      followingNumber: user.following.length,
      followers: user.followers,
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
        image: user.image,
        createdAt: user.createdAt,
        followerNumber: user.followers.length,
        followingNumber: user.following.length,
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

    const { username, email, password, newPassword, image } = req.body;

    if (user) {
      if (user.isGoogleLogin) {
        res.status(400);
        throw new Error(
          "You cannot update values since you are logged in through Google"
        );
      }

      if (!username && !email && !newPassword && !image) {
        res.status(400);
        throw new Error("Please send something to update");
      }

      if (email && !validator.isEmail(email)) {
        res.status(400);
        throw new Error("Email is not valid");
      }

      if (!password) {
        res.status(400);
        throw new Error("Please send your password to update user info");
      }
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        res.status(400);
        throw new Error("Incorrect password");
      }

      let emailExists, usernameExists;

      if (email) {
        emailExists = await User.findOne({ email, isGoogleLogin: false });
      }
      if (username) {
        usernameExists = await User.findOne({ username, isGoogleLogin: false });
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

      if (newPassword && !validator.isStrongPassword(newPassword)) {
        res.status(400);
        throw new Error("New password is not strong enough");
      }
      if (newPassword && password === newPassword) {
        res.status(400);
        throw new Error("Your new password can't be same as your current one");
      }
      if (username && !validator.matches(username, "^[a-zA-Z0-9_.-]*$")) {
        res.status(400);
        throw new Error(
          "Username can only contain English letters (both uppercase and lowercase), numbers, underscores (_), dots (.), and hyphens (-)"
        );
      }
      if (image && !validator.isURL(image)) {
        res.status(400);
        throw new Error("Image Url is not valid");
      }

      user.username = username || user.username;
      user.newEmail = email || user.newEmail;
      user.image = image || user.image;

      if (newPassword) {
        user.password = newPassword;
      }

      let message;
      if (email) {
        // create a token
        const token = generateVerificationToken(user._id);

        //send email
        await sendEmail("email-verification", email, username, token, next);

        message =
          "Profile updated. A verification email has been sent to your new email adress to verify it";
      } else {
        message = "Profile updated";
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        image: updatedUser.image,
        isGoogleLogin: updatedUser.isGoogleLogin,
        message,
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
    await User.updateMany(
      {},
      { $pull: { followers: user._id, following: user._id } }
    );

    await User.updateMany(
      { "notifications.user": user._id }, // Find users with notifications by the user
      { $pull: { notifications: { user: user._id } } } // Remove notifications made by the user
    );

    const userLikeIds = await Like.find({ user: user._id });

    await Like.deleteMany({ user: user._id });

    await Article.updateMany(
      { likes: { $in: userLikeIds } }, // Find articles with likes by the user
      { $pull: { likes: { $in: userLikeIds } } } // Remove the like IDs from the likes array
    );

    await Article.deleteMany({ user: user._id });

    await Article.updateMany(
      { "comments.user": user._id }, // Find articles with comments by the user
      { $pull: { comments: { user: user._id } } } // Remove comments made by the user
    );

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
