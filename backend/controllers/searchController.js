const { Article } = require("../models/articleModel");
const User = require("../models/userModel");

//get articles and users by search
const getBySearch = async (req, res, next) => {
  const { search } = req.query;
  try {
    const param = new RegExp(search, "i");
    const users = await User.find({ username: param }).select("-password");

    const articles = await Article.find({ title: param });

    res.status(200).json({ users, articles });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBySearch,
};
