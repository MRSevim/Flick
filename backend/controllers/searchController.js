const { Article } = require("../models/articleModel");
const User = require("../models/userModel");

const selectFields = "_id title likes tags user image";
//get articles and users by search
const getBySearch = async (req, res, next) => {
  const { search } = req.query;

  try {
    let users = [];
    let articles = [];

    if (search) {
      const param = new RegExp(search, "i");

      users = await User.find({ username: param }).select("_id username image");

      articles = await Article.find({
        title: param,
        isDraft: false,
      })
        .select(selectFields)
        .populate("user", "username");
    }

    res.status(200).json({ users, articles });
  } catch (error) {
    next(error);
  }
};
const getByAdvancedSearch = async (req, res, next) => {
  const { username, title, tags } = req.query;

  try {
    if (!username && !title && !tags) {
      res.status(400);
      throw new Error("Please send some search params");
    }
    let users = [];
    let articles = [];

    if (username) {
      const param = new RegExp(username, "i");
      users = await User.find({ username: param }).select("_id username image");
    }

    const query = { isDraft: false };

    if (title) {
      const param = new RegExp(title, "i");
      query.title = param;
    }
    if (tags) {
      query.tags = { $all: tags.split(",") };
    }

    if (title || tags) {
      articles = await Article.find(query)
        .select(selectFields)
        .populate("user", "username");
    }

    if (username) {
      const param = new RegExp(username, "i");
      articles = articles.filter((article) => {
        return param.test(article.user.username);
      });
    }

    res.status(200).json({ users, articles });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBySearch,
  getByAdvancedSearch,
};
