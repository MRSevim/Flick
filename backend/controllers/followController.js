const User = require("../models/userModel");

const getFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "username image"
    );
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    res.status(200).json({
      username: user.username,
      _id: user._id,
      followers: user.followers,
    });
  } catch (error) {
    next(error);
  }
};
const getFollowing = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "username image"
    );
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    res.status(200).json({
      username: user.username,
      _id: user._id,
      followings: user.following,
    });
  } catch (error) {
    next(error);
  }
};

// follow user
const followUser = async (req, res, next) => {
  try {
    if (req.user._id.equals(req.params.id)) {
      res.status(400);
      throw new Error("You cannot follow yourself");
    }

    const user = await User.findById(req.user._id);
    const followedUser = await User.findById(req.params.id).select(
      "-email -isGoogleLogin -updatedAt"
    );

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }
    if (!followedUser) {
      res.status(404);
      throw new Error("Target user is not found");
    }

    if (!followedUser.followers.includes(user._id)) {
      message = "You followed " + followedUser.username;
      followedUser.followers.push(user._id);
      const notification = {
        users: [user._id],
        action: "follow",
        target: null,
      };
      const existingNotification = followedUser.notifications.find(
        (notification) => {
          return notification.action === "follow";
        }
      );
      if (existingNotification) {
        //add user to users array if user is not in it
        if (!existingNotification.users.includes(user._id))
          existingNotification.users.push(user._id);
      } else {
        followedUser.notifications.push(notification);
      }

      await followedUser.save();

      user.following.push(followedUser._id);
      await user.save();
    } else {
      message = "You unfollowed " + followedUser.username;
      followedUser.followers = followedUser.followers.filter((id) => {
        return id.toString() !== user._id.toString();
      });
      await followedUser.save();

      user.following = user.following.filter((id) => {
        return id.toString() !== followedUser._id.toString();
      });
      await user.save();
    }

    res.status(200).json({
      message,
      followedUser: {
        _id: followedUser._id,
        username: followedUser.username,
        followers: followedUser.followers,
        following: followedUser.following,
      },
      followerNumber: followedUser.followers.length,
      followingNumber: followedUser.following.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  followUser,
  getFollowers,
  getFollowing,
};
