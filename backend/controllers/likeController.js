const { Article, Like } = require("../models/articleModel");
const User = require("../models/userModel");
const { DateTime } = require("luxon");

// Get the current date and time
const nowUtc = DateTime.utc();

const startOfWeekUtc = nowUtc.startOf("week");
const startOfMonthUtc = nowUtc.startOf("month");
const startOfYearUtc = nowUtc.startOf("year");

//get most liked posts of the week
const getWeekly = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

//get most liked posts of the month
const getMonthly = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

//get most liked posts of the year
const getYearly = async (req, res, next) => {
  try {
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

    const article = await Article.findById(req.params.id);
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
    const like = await Like.find({
      user: user._id,
      article: article._id,
    });

    if (like[0]) {
      message = "You disliked the article";
      article.likes = article.likes.filter((item) => {
        return !item.equals(like[0]._id);
      });
      await like[0].deleteOne();
    } else {
      const like = await Like.create({
        article: article._id,
        user: user._id,
      });
      article.likes.push(like._id);
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
