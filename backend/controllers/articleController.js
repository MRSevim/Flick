const { Article } = require("../models/articleModel");
const User = require("../models/userModel");
const sanitizeHtml = require("sanitize-html");

const allowedTags = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
};

//get an article
const getArticle = async (req, res, next) => {
  try {
    res.status(200).json({});
  } catch (error) {
    next(error);
  }
};

//get articles of specific user
const getArticles = async (req, res, next) => {
  try {
    res.status(200).json({});
  } catch (error) {
    next(error);
  }
};

//authenticated user create article
const createArticle = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400);
      throw new Error("Title and content can't be empty");
    }

    const sanitizedTitle = sanitizeHtml(title);
    const sanitizedContent = sanitizeHtml(content, allowedTags);

    if (!sanitizedTitle || !sanitizedContent) {
      res.status(400);
      throw new Error("Sanitized inputs can't be empty");
    }

    const article = await Article.create({
      title: sanitizedTitle,
      content: sanitizedContent,
      userId: user._id,
    });

    res.status(200).json({ ...article._doc });
  } catch (error) {
    next(error);
  }
};

//authenticated user update article
const updateArticle = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    res.status(200).json({});
  } catch (error) {
    next(error);
  }
};

//authenticated user delete article
const deleteArticle = async (req, res, next) => {
  try {
    res.status(200).json({});
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticle,
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
};
