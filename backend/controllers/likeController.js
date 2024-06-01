const { Article, Like } = require("../models/articleModel");
const User = require("../models/userModel");
const { DateTime } = require("luxon");

//get most liked posts
const getMostLiked = async (req, res, next) => {
  const nowUtc = DateTime.utc();
  const time = req.params.time;

  const startOf = nowUtc.startOf(time);

  try {
    const articles = await Like.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOf.toJSDate(),
            $lte: nowUtc.toJSDate(),
          },
        },
      },
      {
        $lookup: {
          from: "articles",
          localField: "article",
          foreignField: "_id",
          as: "article",
        },
      },
      {
        $unwind: "$article",
      },
      {
        $sort: { createdAt: -1 }, // Sorting by like creation date
      },
      {
        $group: {
          _id: "$article._id",
          title: { $first: "$article.title" },
          content: { $first: "$article.content" },
          isDraft: { $first: "$article.isDraft" },
          user: { $first: "$article.user" },
          likes: { $push: { _id: "$_id", user: "$user" } },
          createdAt: { $first: "$article.createdAt" },
          updatedAt: { $first: "$article.updatedAt" },
          tags: { $first: "$article.tags" },
          image: { $first: "$article.image" },
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" }, // Calculate the likeCount
        },
      },
      {
        $match: {
          isDraft: false, // Exclude draft articles
        },
      },
      {
        $sort: { likeCount: -1, createdAt: -1 },
      },
      {
        $limit: 10, // You can adjust the limit based on how many top articles you want
      },
    ]);
    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

//authenticated user like article
const like = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    const article = await Article.findById(req.params.id)
      .populate("likes", "user")
      .populate("user", "username");

    if (!article) {
      res.status(404);
      throw new Error("Article is not found");
    }

    if (article.isDraft) {
      res.status(400);
      throw new Error("You cannot like drafts");
    }

    if (user._id.equals(article?.user?._id)) {
      res.status(400);
      throw new Error("You cannot like your own articles");
    }

    let message;
    const like = await Like.findOne({
      user: user._id,
      article: article._id,
    });
    const notifiedUser = await User.findById(article?.user?._id);
    const existingNotification = notifiedUser.notifications.find(
      (notification) => {
        return (
          notification.target?.toString() === article._id.toString() &&
          notification.action === "like"
        );
      }
    );
    if (like) {
      message = "You disliked the article";
      article.likes = article.likes.filter((item) => {
        return !item.equals(like._id);
      });
      await like.deleteOne();
      if (existingNotification) {
        if (existingNotification.users.includes(user._id)) {
          if (existingNotification.users.length === 1) {
            notifiedUser.notifications = notifiedUser.notifications.filter(
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
    } else {
      const like = await Like.create({
        article: article._id,
        user: user._id,
      });
      article.likes.push({ _id: like._id, user: user._id });
      message = "You liked the article";

      const notification = {
        users: [user._id],
        action: "like",
        target: article._id,
      };
      if (!notifiedUser.newNotificationsDisabled) {
        if (existingNotification) {
          //add user to users array if user is not in it
          if (!existingNotification.users.includes(user._id))
            existingNotification.users.push(user._id);
        } else {
          notifiedUser.notifications.push(notification);
        }
      }
    }
    await notifiedUser.save();
    const updatedArticle = await article.save();

    res.status(200).json({ message, updatedArticle });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  like,
  getMostLiked,
};
