const { User } = require("../models/userModel");

const getFollows = async (req, res, next) => {
  const { page, type } = req.query;
  try {
    const LIMIT = 18;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    const fullUser = await User.findById(req.params.id);

    if (!fullUser) {
      res.status(404);
      throw new Error("User is not found");
    }
    if (!page) {
      res.status(400);
      throw new Error("Please send a page number");
    }
    if (!type || (type !== "followers" && type !== "following")) {
      res.status(400);
      throw new Error("Please send a type (followers or following)");
    }

    const total =
      type === "followers"
        ? fullUser.followers.length
        : fullUser.following.length;

    const user = await User.findById(req.params.id).populate({
      path: type,
      select: "username image",
      options: {
        sort: { username: 1 }, // Sort by username in ascending order (alphabetical)
        skip: startIndex,
        limit: LIMIT,
      },
    });

    res.status(200).json({
      username: user.username,
      _id: user._id,
      [type]: user[type],
      currentPage: Number(page),
      totalPages: Math.ceil(total / LIMIT),
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
    const existingNotification = followedUser.notifications.find(
      (notification) => {
        return notification.action === "follow";
      }
    );
    if (!followedUser.followers.includes(user._id)) {
      message = "You followed " + followedUser.username;
      followedUser.followers.push(user._id);
      const notification = {
        users: [user._id],
        action: "follow",
        target: null,
      };
      if (!followedUser.newNotificationsDisabled) {
        if (existingNotification) {
          //add user to users array if user is not in it
          if (!existingNotification.users.includes(user._id))
            existingNotification.users.push(user._id);
        } else {
          followedUser.notifications.push(notification);
        }
      }

      await followedUser.save();

      user.following.push(followedUser._id);
      await user.save();
    } else {
      message = "You unfollowed " + followedUser.username;
      followedUser.followers = followedUser.followers.filter((id) => {
        return id.toString() !== user._id.toString();
      });

      if (existingNotification) {
        if (existingNotification.users.includes(user._id)) {
          if (existingNotification.users.length === 1) {
            followedUser.notifications = followedUser.notifications.filter(
              (notification) => {
                return (
                  notification._id.toString() !==
                  existingNotification._id.toString()
                );
              }
            );
          } else {
            existingNotification.users = existingNotification.users.filter(
              (id) => id.toString() !== user._id.toString()
            );
          }
        }
      }

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
  getFollows,
};
