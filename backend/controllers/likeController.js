const { Article, Like } = require("../models/articleModel");
const User = require("../models/userModel");
const { DateTime } = require("luxon");

//get most liked posts of the week
const getWeekly = async (req, res, next) => {
  // Get the current date and time
  const nowUtc = DateTime.utc();
  const startOfWeekUtc = nowUtc.startOf("week");

  try {
    const articles = await Like.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfWeekUtc.toJSDate(),
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
          likes: { $push: "$_id" },
          createdAt: { $first: "$article.createdAt" },
          updatedAt: { $first: "$article.updatedAt" },
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
        $sort: { likeCount: -1 },
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

//get most liked posts of the month
const getMonthly = async (req, res, next) => {
  // Get the current date and time
  const nowUtc = DateTime.utc();
  const startOfMonthUtc = nowUtc.startOf("month");

  try {
    const articles = await Like.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonthUtc.toJSDate(),
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
          likes: { $push: "$_id" },
          createdAt: { $first: "$article.createdAt" },
          updatedAt: { $first: "$article.updatedAt" },
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
        $sort: { likeCount: -1 },
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

//get most liked posts of the year
const getYearly = async (req, res, next) => {
  // Get the current date and time
  const nowUtc = DateTime.utc();
  const startOfYearUtc = nowUtc.startOf("year");

  try {
    const articles = await Like.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYearUtc.toJSDate(),
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
          likes: { $push: "$_id" },
          createdAt: { $first: "$article.createdAt" },
          updatedAt: { $first: "$article.updatedAt" },
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
        $sort: { likeCount: -1 },
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

    if (user._id.equals(article.user)) {
      res.status(400);
      throw new Error("You cannot like your own articles");
    }

    let message;
    const like = await Like.findOne({
      user: user._id,
      article: article._id,
    });

    if (like) {
      message = "You disliked the article";
      article.likes = article.likes.filter((item) => {
        return !item.equals(like._id);
      });
      await like.deleteOne();
    } else {
      const like = await Like.create({
        article: article._id,
        user: user._id,
      });
      article.likes.push({ _id: like._id, user: user._id });
      message = "You liked the article";
    }
    const updatedArticle = await article.save();

    res.status(200).json({ message, updatedArticle });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  like,
  getWeekly,
  getMonthly,
  getYearly,
};
