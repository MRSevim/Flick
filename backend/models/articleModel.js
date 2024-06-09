const mongoose = require("mongoose");
const Tags = require("../Tags");

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
    image: {
      type: String,
      default: `${process.env.BACKEND_URL}/default-image.png`,
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
    tags: [
      {
        type: String,
        validate: {
          validator: function (tag) {
            // Check if the tag is present in the Tags array
            return Tags.includes(tag);
          },
          message: (props) => `${props.value} is not a valid tag!`,
        },
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
