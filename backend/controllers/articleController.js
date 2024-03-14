const { Article, Like } = require("../models/articleModel");
const User = require("../models/userModel");
const sanitizeHtml = require("sanitize-html");

const allowedTags = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
};

//get an article
const getArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("user", "id username")
      .populate("likes", "user");

    if (!article) {
      res.status(404);
      throw new Error("Article is not found");
    }
    if (article.isDraft) {
      res.status(401);
      throw new Error("Use /draft/:id for draft articles");
    }

    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

//get articles of specific user
const getArticles = async (req, res, next) => {
  const { page } = req.query;

  try {
    if (!page) {
      res.status(400);
      throw new Error("Please send a page number");
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    const LIMIT = 9;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const totalArticles = await Article.find({
      user: user._id,
      isDraft: false,
    });

    const total = totalArticles.length;

    const articles = await Article.find({
      user: user._id,
      isDraft: false,
    })
      .sort({
        createdAt: -1,
      })
      .populate("likes", "user")
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      articles,
      currentPage: Number(page),
      totalPages: Math.ceil(total / LIMIT),
      user: {
        _id: user._id,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

//authenticated user get drafts
const getDrafts = async (req, res, next) => {
  const { page } = req.query;

  try {
    if (!page) {
      res.status(400);
      throw new Error("Please send a page number");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    const LIMIT = 9;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const totalArticles = await Article.find({
      user: user._id,
      isDraft: true,
    });

    const total = totalArticles.length;

    const articles = await Article.find({
      user: user._id,
      isDraft: true,
    })
      .sort({
        createdAt: -1,
      })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      articles,
      currentPage: Number(page),
      totalPages: Math.ceil(total / LIMIT),
      user: {
        _id: user._id,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
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

    const article = await Article.findById(req.params.id).populate(
      "user",
      "id username"
    );

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
    if (!user._id.equals(article.user._id)) {
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
      user: user._id,
    });

    res.status(201).json(article);
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

    if (!user._id.equals(article.user)) {
      res.status(401);
      throw new Error("You are not authorized");
    }
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    const { title, content, isDraft } = req.body;

    if (!title && !content && !isDraft) {
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
    if (isDraft !== undefined) {
      article.isDraft = isDraft;
    }

    const updatedArticle = await article.save();

    res.status(200).json({
      _id: updatedArticle._id,
      title: updatedArticle.title,
      content: updatedArticle.content,
      isDraft: updatedArticle.isDraft,
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

    if (!user._id.equals(article.user)) {
      res.status(401);
      throw new Error("You are not authorized");
    }
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    await article.deleteOne();
    await Like.deleteMany({ article: article._id });

    res.status(200).json({ id: article._id });
  } catch (error) {
    next(error);
  }
};
const deleteMany = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { ids } = req.body;

    const articles = await Article.find({ _id: { $in: ids } });
    const allMatch = articles.every((article) => user._id.equals(article.user));
    if (!ids) {
      res.status(400);
      throw new Error("Please send array of ids");
    }
    if (ids.length === 0) {
      res.status(400);
      throw new Error("Please select at least 1 article to delete");
    }
    if (articles.length === 0) {
      res.status(404);
      throw new Error("There is no matching article");
    }
    if (articles.length !== ids.length) {
      res.status(404);
      throw new Error("Some of the articles are already deleted");
    }
    if (!allMatch) {
      res.status(404);
      throw new Error("Some of those articles are not yours to delete");
    }
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }
    await Article.deleteMany({ _id: { $in: ids } });
    await Like.deleteMany({ article: { $in: ids } });

    res.status(200).json({ message: "Articles are successfully deleted" });
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
  deleteMany,
};
