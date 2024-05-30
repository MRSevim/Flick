const { Article } = require("../models/articleModel");
const User = require("../models/userModel");
const sanitizeHtml = require("sanitize-html");

const createNotifiedUserAndNotification = async (article) => {
  const notifiedUser = await User.findById(article?.user?._id);

  const existingNotification = notifiedUser.notifications.find(
    (notification) => {
      return (
        notification.target?.toString() === article?._id?.toString() &&
        notification.action === "comment"
      );
    }
  );
  return { notifiedUser, existingNotification };
};

//comment
const comment = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const article = await Article.findById(req.params.id);
    const { content } = req.body;

    if (!article) {
      res.status(404);
      throw new Error("Article is not found");
    }

    if (article.isDraft) {
      res.status(400);
      throw new Error("You cannot comment on draft articles");
    }

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    if (!content) {
      res.status(400);
      throw new Error("Content can't be empty");
    }

    const sanitizedContent = sanitizeHtml(content);

    if (!sanitizedContent) {
      res.status(400);
      throw new Error("Sanitized input can't be empty");
    }
    const comment = {
      user: user._id,
      content: sanitizedContent,
    };

    article.comments.push(comment);

    // Get the comment ID after pushing it to the array
    const newComment = article.comments[article.comments.length - 1];
    const commentId = newComment._id;

    const notification = {
      users: [user._id],
      action: "comment",
      target: article._id,
      commentIds: [commentId],
    };

    //do no notify if you commented on your own article
    if (!user._id.equals(article.user._id)) {
      const { notifiedUser, existingNotification } =
        await createNotifiedUserAndNotification(article);

      if (existingNotification) {
        //add user to users array if user is not in it
        if (!existingNotification.users.includes(user._id)) {
          existingNotification.users.push(user._id);
        }
        existingNotification.commentIds.push(commentId);
      } else {
        notifiedUser.notifications.push(notification);
      }
      await notifiedUser.save();
    }

    await article.save();

    const updatedArticle = await Article.findById(req.params.id).populate({
      path: "comments",
      populate: {
        path: "user",
        model: "User",
        select: "username image",
      },
    });

    res.status(200).json(updatedArticle);
  } catch (error) {
    next(error);
  }
};

//edit a comment
const edit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const article = await Article.findById(req.params.id).populate({
      path: "comments",
      populate: {
        path: "user",
        model: "User",
        select: "username image",
      },
    });
    const { content, id } = req.body;

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    if (!content) {
      res.status(400);
      throw new Error("Content can't be empty");
    }

    if (!article) {
      res.status(404);
      throw new Error("Article is not found");
    }

    const sanitizedContent = sanitizeHtml(content);

    if (!sanitizedContent) {
      res.status(400);
      throw new Error("Sanitized input can't be empty");
    }

    const editedComment = article.comments.find((comment) => {
      return comment._id.toString() === id.toString();
    });

    if (!editedComment) {
      res.status(404);
      throw new Error("Comment is not found");
    }

    if (!user._id.equals(editedComment.user._id)) {
      res.status(401);
      throw new Error("You are not authorized");
    }

    editedComment.content = sanitizedContent;

    await article.save();

    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

//delete comment
const deleteComment = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const article = await Article.findById(req.params.id);
    const { id } = req.body;

    if (!user) {
      res.status(404);
      throw new Error("User is not found");
    }

    if (!article) {
      res.status(404);
      throw new Error("Article is not found");
    }

    const commentToBeDeleted = article.comments.find((comment) => {
      return comment._id.toString() === id.toString();
    });

    if (!commentToBeDeleted) {
      res.status(404);
      throw new Error("Comment is not found");
    }

    if (!user._id.equals(commentToBeDeleted.user._id)) {
      res.status(401);
      throw new Error("You are not authorized");
    }

    const comments = article.comments.filter((comment) => {
      return comment._id.toString() !== id.toString();
    });

    const { notifiedUser, existingNotification } =
      await createNotifiedUserAndNotification(article);

    if (existingNotification) {
      // Remove the deleted comment ID from the notification
      existingNotification.commentIds = existingNotification.commentIds.filter(
        (_id) => _id.toString() !== id.toString()
      );

      // Check if there are any remaining comments from the user
      const userHasOtherComments = existingNotification.commentIds.some(
        (_id) => {
          const comment = article.comments.find(
            (c) => c._id.toString() === _id.toString()
          );
          return comment && comment.user.toString() === user._id.toString();
        }
      );

      if (!userHasOtherComments) {
        // Remove the user from the notification's users array
        existingNotification.users = existingNotification.users.filter(
          (_id) => _id.toString() !== user._id.toString()
        );
      }

      // Remove the notification if no users remain
      if (existingNotification.users.length === 0) {
        notifiedUser.notifications = notifiedUser.notifications.filter(
          (notification) => {
            return (
              notification._id.toString() !==
              existingNotification._id.toString()
            );
          }
        );
      }

      await notifiedUser.save();
    }

    article.comments = comments;

    await article.save();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  comment,
  edit,
  deleteComment,
};
