const { User } = require("../models/userModel");

//get notifications
const getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "notifications",
      populate: [
        {
          path: "users",
          model: "User",
          select: "username",
        },
        {
          path: "target",
          model: "Article",
          select: "title",
        },
      ],
    });

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    const sortedNotifications = user.notifications.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );

    res.status(200).json(sortedNotifications);
  } catch (error) {
    next(error);
  }
};

//clear notifications
const clearNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }
    user.notifications = [];
    await user.save();

    res.status(200).json({ message: "Notifications cleared" });
  } catch (error) {
    next(error);
  }
};

//mark as read
const markAsRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }
    user.notifications.forEach((notification) => {
      notification.read = true;
    });
    await user.save();

    res.status(200).json(user.notifications);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  clearNotifications,
  markAsRead,
};
