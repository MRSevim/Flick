const { Article, Like } = require("../models/articleModel");
const { User } = require("../models/userModel");
const sanitizeHtml = require("sanitize-html");
const validator = require("validator");

const allowedTags = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
};
//get similar articles
const getSimilar = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404);
      throw new Error("Article is not found");
    }
    if (article.isDraft) {
      res.status(400);
      throw new Error("You cannot get similar articles of drafts");
    }
    const articles = await Article.aggregate([
      { $match: { tags: { $in: article.tags }, isDraft: false } },
      { $sample: { size: 10 } },
      {
        $project: {
          comments: 0,
        },
      },
      {
        $match: { _id: { $ne: article._id } }, // Exclude the original article by its _id
      },
    ]);

    await Article.populate(articles, {
      path: "user",
      select: "username",
    });

    res.status(200).json(articles);
  } catch (error) {
    next(error);
  }
};
//get an article
const getArticle = (isDraft) => {
  return async (req, res, next) => {
    try {
      if (isDraft === undefined) {
        res.status(400);
        throw new Error("Pass isDraft boolean into getArticle function");
      }

      const article = await Article.findById(req.params.id)
        .populate("user", "username")
        .populate("likes", "user")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            model: "User",
            select: "username image",
          },
        });

      if (!article) {
        res.status(404);
        throw new Error("Article is not found");
      }

      if (isDraft) {
        const user = await User.findById(req.user._id);

        if (!user) {
          res.status(404);
          throw new Error("User is not found");
        }

        if (!user._id.equals(article.user._id)) {
          res.status(401);
          throw new Error("You are not authorized");
        }

        if (!article.isDraft) {
          res.status(400);
          throw new Error(
            "Article is not draft. Please use article/:id for non-draft articles"
          );
        }
      }

      if (isDraft === false && article.isDraft) {
        res.status(401);
        throw new Error(
          "Article is draft. Please use article/draft/:id for draft articles"
        );
      }

      res.status(200).json(article);
    } catch (error) {
      next(error);
    }
  };
};

//get articles of specific user
const getArticles = (isDraft) => {
  return async (req, res, next) => {
    const { page, title, tags } = req.query;

    try {
      if (isDraft === undefined) {
        res.status(400);
        throw new Error("Pass isDraft boolean into getArticle function");
      }

      if (!page) {
        res.status(400);
        throw new Error("Please send a page number");
      }

      const user = await User.findById(req.params.id);
      const authUser = await User.findById(req.user?._id);

      if (!isDraft && !user) {
        res.status(404);
        throw new Error("User is not found");
      }

      if (isDraft && !authUser) {
        res.status(404);
        throw new Error("User is not found");
      }

      const query = {
        user: isDraft ? authUser._id : user._id,
        isDraft,
      };

      if (title) {
        const param = new RegExp(title, "i");
        query.title = param;
      }
      if (tags) {
        query.tags = { $in: tags.split(",") };
      }

      let LIMIT = 9;
      const currentPage = Number(page);
      let startIndex = (currentPage - 1) * LIMIT; // get the starting index of every page
      const totalArticles = await Article.find(query);
      const total = totalArticles.length;
      const totalPages = Math.ceil(total / LIMIT);

      if (currentPage === 1) {
        // Calculate remaining articles for the first page
        const remainingArticles = total % LIMIT;
        startIndex = 0;
        LIMIT = remainingArticles === 0 ? LIMIT : remainingArticles;
      } else {
        startIndex = (currentPage - 2) * LIMIT + (total % LIMIT);
      }

      const articles = await Article.find(query)
        .sort({
          createdAt: -1,
        })
        .populate("likes", "user")
        .limit(LIMIT)
        .skip(startIndex);

      res.status(200).json({
        articles,
        currentPage,
        totalPages,
        user: {
          _id: isDraft ? authUser._id : user._id,
          username: isDraft ? authUser.username : user.username,
          createdAt: isDraft ? authUser.createdAt : user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };
};

//authenticated user create article
const createArticle = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    const { title, content, isDraft, tags, image } = req.body;

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
    if (image && !validator.isURL(image)) {
      res.status(400);
      throw new Error("Featured Image Url is not valid");
    }

    const article = await Article.create({
      title: sanitizedTitle,
      content: sanitizedContent,
      isDraft,
      user: user._id,
      tags,
      image: image || undefined,
    });

    const notification = {
      users: [user._id],
      action: "release",
      target: article._id,
    };

    // Notify all followers
    for (const followerId of user.followers) {
      const follower = await User.findById(followerId);
      if (!follower.newNotificationsDisabled) {
        await User.findByIdAndUpdate(followerId, {
          $push: { notifications: notification },
        });
      }
    }

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

    const { title, content, isDraft, tags, image } = req.body;

    if (!title && !content && isDraft === undefined && !tags && !image) {
      res.status(400);
      throw new Error("Please send some input to update");
    }

    if (!title || !content) {
      res.status(400);
      throw new Error("Title and content can't be empty");
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
    if (image && !validator.isURL(image)) {
      res.status(400);
      throw new Error("Featured Image Url is not valid");
    }

    article.title = sanitizedTitle || article.title;
    article.content = sanitizedContent || article.content;
    article.tags = tags || article.tags;
    article.image = image || article.image;
    if (isDraft !== undefined) {
      article.isDraft = isDraft;
    }

    const updatedArticle = await article.save();

    res.status(200).json({
      _id: updatedArticle._id,
      title: updatedArticle.title,
      content: updatedArticle.content,
      isDraft: updatedArticle.isDraft,
      tags: updatedArticle.tags,
      image: updatedArticle.image,
    });
  } catch (error) {
    next(error);
  }
};

//authenticated user delete article
const deleteArticle = async (req, res, next) => {
  const { reasonOfDeletion } = req.body;
  const removeRelatedNotification = async (article) => {
    // Find and remove notifications related to this article
    await User.updateMany(
      { "notifications.target": article._id },
      { $pull: { notifications: { target: article._id } } }
    );
  };
  try {
    const user = await User.findById(req.user._id);
    const article = await Article.findById(req.params.id);

    if (!article) {
      res.status(404);
      throw new Error("Article is not found");
    }
    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    if (!user._id.equals(article.user) && user.role === "user") {
      res.status(401);
      throw new Error("You are not authorized");
    }
    if (user.role !== "user" && !user._id.equals(article.user)) {
      const articleUser = await User.findById(article.user);
      if (
        user.role === "mod" &&
        (articleUser.role === "mod" || articleUser.role === "admin")
      ) {
        res.status(400);
        throw new Error("You cannot delete since owner is admin/mod");
      }
      if (!reasonOfDeletion) {
        res.status(400);
        throw new Error("Please send a reason of deletion");
      }

      const notification = {
        reasonOfDeletion,
        action: "article deletion",
        target: article._id,
      };

      await removeRelatedNotification(article);

      await User.findByIdAndUpdate(article.user, {
        $push: { notifications: notification },
      });
    }

    if (user._id.equals(article.user)) {
      await removeRelatedNotification(article);
    }

    await article.deleteOne();
    await Like.deleteMany({ article: article._id });

    res.status(200).json({ id: article._id });
  } catch (error) {
    next(error);
  }
};
//authenticated user delete articles
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
    // Find and remove notifications related to these articles
    await User.updateMany(
      { "notifications.target": { $in: ids } },
      { $pull: { notifications: { target: { $in: ids } } } }
    );
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
  deleteMany,
  getSimilar,
};
