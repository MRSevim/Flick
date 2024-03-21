const User = require("../models/userModel");

//get notifications
const getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "notifications",
      populate: [
        {
          path: "user",
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
    res.status(200).json(user.notifications);
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

module.exports = {
  getNotifications,
  clearNotifications,
};
