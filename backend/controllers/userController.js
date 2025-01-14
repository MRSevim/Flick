const { User, Banned } = require("../models/userModel");
const { Article, Like } = require("../models/articleModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const envVariables = require("../envVariables");
const emailQueue = require("../worker");

const {
  generateToken,
  generateVerificationToken,
  getDecodedOAuthJwtGoogle,
} = require("../helpers");

//get all users
const getAll = async (req, res, next) => {
  try {
    const users = await User.find().select("_id updatedAt");

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// login a user
const loginUser = async (req, res, next) => {
  const { username, password, isGoogleLogin, googleCredential, rememberMe } =
    req.body;

  try {
    if (!isGoogleLogin) {
      const user = await User.login(res, username, password);

      if (!user) {
        res.status(404);
        throw new Error("User is not found");
      }

      if (rememberMe === undefined) {
        res.status(400);
        throw new Error("Please send a rememberMe boolean");
      }

      // create a token
      generateToken(res, user._id, rememberMe);

      res.status(201).json({
        _id: user._id,
        username,
        isGoogleLogin: user.isGoogleLogin,
        image: user.image,
        role: user.role,
      });
    } else {
      const ticket = await getDecodedOAuthJwtGoogle(googleCredential, next);
      const { picture, name, email } = ticket.getPayload();
      const user = await User.googleLogin(res, name, email, picture);

      if (!user) {
        res.status(404);
        throw new Error("User is not found");
      }

      // create a token
      generateToken(res, user._id, rememberMe);

      res.status(201).json({
        _id: user._id,
        username: name,
        isGoogleLogin: user.isGoogleLogin,
        image: user.image,
        role: user.role,
      });
    }
  } catch (error) {
    next(error);
  }
};

// signup a user
const signupUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  const urlToken = req.params.token;

  try {
    let role = "user";
    if (urlToken) {
      const decoded = jwt.verify(urlToken, envVariables.jwtSecret);

      role = decoded.role;
    }
    const user = await User.signup(res, username, email, password, role);

    // create a token
    const token = generateVerificationToken(user._id);

    // Add email-sending task to the queue
    emailQueue.add("email", {
      type: "email-verification",
      email,
      username,
      info: { token },
    });

    res.status(201).json({
      message: "A verification email has been sent to your account",
    });
  } catch (error) {
    next(error);
  }
};

// logout user
const logoutUser = (req, res) => {
  let cookieOptions = {
    httpOnly: true,
    expires: new Date(0),
    secure: envVariables.env !== "development", // Use secure cookies in production
    sameSite: "strict",
  };
  res.cookie("jwt", "", cookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
};

// logout user
const generateModLink = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }
    if (user.role !== "admin") {
      res.status(400);
      throw new Error("You cannot create mod links");
    }

    const token = jwt.sign({ role: "mod" }, envVariables.jwtSecret, {
      expiresIn: "30m", // Expiring after 30 minutes
    });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

//get Public User
const getPublicUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      $or: [
        { isVerified: true, isGoogleLogin: false },
        { isGoogleLogin: true },
      ],
    });
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    const articles = await Article.aggregate([
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

    const articleIds = articles.map((article) => article._id);

    const mostLikedArticles = await Article.find({
      _id: { $in: articleIds },
    }).populate("likes", "user");

    // Sort the populated articles to match the order of articleIds
    const sortedArticles = articleIds.map((id) =>
      mostLikedArticles.find((article) => article._id.equals(id))
    );

    res.status(200).json({
      _id: user._id,
      username: user.username,
      createdAt: user.createdAt,
      image: user.image,
      mostLikedArticles: sortedArticles,
      followerNumber: user.followers.length,
      followingNumber: user.following.length,
      followers: user.followers,
      role: user.role,
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
        role: user.role,
        createdAt: user.createdAt,
        followerNumber: user.followers.length,
        followingNumber: user.following.length,
        newNotificationsDisabled: user.newNotificationsDisabled,
        newPmsDisabled: user.newPmsDisabled,
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
      if (
        image &&
        !validator.isURL(image) &&
        image !== envVariables.defaultUserImage
      ) {
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

        // Add email-sending task to the queue
        emailQueue.add("email", {
          type: "email-verification",
          email,
          username,
          info: { token },
        });

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
        role: updatedUser.role,
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

    await user.deleteOne();

    res.status(200).json({ id: user._id });
  } catch (error) {
    next(error);
  }
};

const banUser = async (req, res, next) => {
  const { reasonOfBan } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const targetUser = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }
    if (user.role !== "admin" && user.role !== "mod") {
      res.status(400);
      throw new Error("You cannot ban users");
    }
    if (
      user.role === "mod" &&
      (targetUser.role === "mod" || targetUser.role === "admin")
    ) {
      res.status(400);
      throw new Error("You cannot ban since target user is admin/mod");
    }
    if (!targetUser) {
      res.status(404);
      throw new Error("Target user is not found");
    }
    if (!reasonOfBan) {
      res.status(400);
      throw new Error("Please send a reason of ban");
    }
    if (targetUser.role === "admin") {
      res.status(400);
      throw new Error("You cannot ban another admin");
    }
    if (targetUser._id.equals(user._id)) {
      res.status(400);
      throw new Error(
        "You cannot ban yourself. Try deleting your account if you wanna remove yourself from the website"
      );
    }

    await targetUser.deleteOne();

    // Add email-sending task to the queue
    emailQueue.add("email", {
      type: "ban-user",
      email: targetUser.email,
      username: targetUser.username,
      info: { reasonOfBan },
    });

    const bannedUser = await Banned.create({
      email: targetUser.email,
      reason: reasonOfBan,
      banner: user._id,
    });

    res.status(200).json({ email: bannedUser.email });
  } catch (error) {
    next(error);
  }
};

const toggleUserVariables = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const type = req.params.type;

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }
    if (type !== "pm" && type !== "notification") {
      res.status(400);
      throw new Error("Please sent a type after /toggle/ (pm or notification)");
    }
    let status;
    if (type === "notification") {
      user.newNotificationsDisabled = !user.newNotificationsDisabled;
      status = user.newNotificationsDisabled;
    } else if (type === "pm") {
      user.newPmsDisabled = !user.newPmsDisabled;
      status = user.newPmsDisabled;
    }
    await user.save();

    res.status(200).json({
      message: `New ${type}s are now ${status ? "disabled" : "enabled"}`,
    });
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
  toggleUserVariables,
  generateModLink,
  banUser,
  getAll,
};
