const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isDraft: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: { type: String, required: true },
        created: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const likeSchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // If you have user authentication
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Article = mongoose.model("Article", articleSchema);
const Like = mongoose.model("Like", likeSchema);

module.exports = { Article, Like };
