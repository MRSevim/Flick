const { Article } = require("../models/articleModel");
const User = require("../models/userModel");

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
      }).select("_id title likes tags");
    }

    res.status(200).json({ users, articles });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBySearch,
};
