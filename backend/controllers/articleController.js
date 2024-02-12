const { Article } = require("../models/articleModel");
const User = require("../models/userModel");
const requireAuth = require("../middlewares/authMiddleware");
const sanitizeHtml = require("sanitize-html");

const allowedTags = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
};

//get an article
const getArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404);
      throw new Error("Article is not found");
    }
    if (article.isDraft) {
      res.status(401);
      throw new Error("You are not authorized");
    }

    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

//get articles of specific user
const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({
      userId: req.params.id,
      isDraft: false,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

//authenticated user get drafts
const getDrafts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    const articles = await Article.find({
      userId: user._id,
      isDraft: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};

//authenticated user get drafts
const getDraft = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    const article = await Article.findById(req.params.id);
    console.log(req.params.id, article);

    if (!article) {
      res.status(404);
      throw new Error("Article is not found");
    }

    if (!article.isDraft) {
      res.status(400);
      throw new Error(
        "Article is not draft. Please use article/:id for non-draft articles"
      );
    }
    if (!user._id.equals(article.userId)) {
      res.status(401);
      throw new Error("You are not authorized");
    }

    res.status(200).json(article);
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

    const { title, content, isDraft } = req.body;

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
      isDraft,
      userId: user._id,
    });

    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

//authenticated user update article
const updateArticle = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404);
      throw new Error("Article is not found");
    }

    if (!user._id.equals(article.userId)) {
      res.status(401);
      throw new Error("You are not authorized");
    }
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    const { title, content } = req.body;

    if (!title && !content) {
      res.status(400);
      throw new Error("Please send some input to update");
    }

    let sanitizedTitle;
    if (title) {
      sanitizedTitle = sanitizeHtml(title);
      if (!sanitizedTitle) {
        res.status(400);
        throw new Error("Sanitized inputs can't be empty");
      }
    }

    let sanitizedContent;
    if (content) {
      sanitizedContent = sanitizeHtml(content, allowedTags);
      if (!sanitizedContent) {
        res.status(400);
        throw new Error("Sanitized inputs can't be empty");
      }
    }

    article.title = sanitizedTitle || article.title;
    article.content = sanitizedContent || article.content;

    const updatedArticle = await article.save();

    res.status(200).json({
      _id: updatedArticle._id,
      title: updatedArticle.title,
      content: updatedArticle.content,
    });
  } catch (error) {
    next(error);
  }
};

//authenticated user delete article
const deleteArticle = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404);
      throw new Error("Article is not found");
    }

    if (!user._id.equals(article.userId)) {
      res.status(401);
      throw new Error("You are not authorized");
    }
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    const deleted = await article.deleteOne();

    res.status(200).json({ id: article._id });
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
  getDraft,
  getDrafts,
};
