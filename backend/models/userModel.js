const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const envVariables = require("../envVariables");
const { Like, Article } = require("./articleModel");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: {
        unique: true,
        partialFilterExpression: { isGoogleLogin: { $eq: false } },
      },
    },
    email: {
      type: String,
      required: true,
    },
    newEmail: { type: String, default: "" },
    password: {
      type: String,
    },
    image: {
      type: String,
      default: envVariables.defaultUserImage,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isGoogleLogin: { type: Boolean, default: false, required: true },
    isVerified: { type: Boolean, default: false, required: true },
    newNotificationsDisabled: { type: Boolean, default: false, required: true },
    newPmsDisabled: { type: Boolean, default: false, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "mod"],
      default: "user",
      required: true,
    },
    notifications: [
      {
        reasonOfDeletion: { type: String },
        users: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        action: { type: String, required: true },
        target: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
        commentIds: [{ type: String }],
        read: { type: Boolean, default: false, required: true },
        created: { type: Date, default: Date.now, required: true },
      },
    ],
    messages: {
      sent: [
        {
          to: {
            _id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            username: {
              type: String,
              required: true,
            },
          },
          subject: {
            type: String,
            required: true,
          },
          message: {
            type: String,
            required: true,
          },
          date: {
            type: Date,
            required: true,
            default: Date.now,
          },
        },
      ],
      received: [
        {
          from: {
            _id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            username: {
              type: String,
              required: true,
            },
          },
          subject: {
            type: String,
            required: true,
          },
          message: {
            type: String,
            required: true,
          },
          read: { type: Boolean, default: false, required: true },
          date: {
            type: Date,
            required: true,
            default: Date.now,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const bannedSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    banner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

userSchema.index(
  { email: 1, isGoogleLogin: 1 },
  {
    unique: true,
  }
);
userSchema.index(
  { createdAt: 1 },
  {
    name: "Partial-TTL-Index",
    partialFilterExpression: { isGoogleLogin: false, isVerified: false },
    expireAfterSeconds: 3600,
  }
);

// static signup method
userSchema.statics.signup = async function (
  res,
  username,
  email,
  password,
  role
) {
  // validation
  if (!username || !password || !email) {
    res.status(400);
    throw new Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Email is not valid");
  }

  const emailExists = await this.findOne({ email, isGoogleLogin: false });
  const usernameExists = await this.findOne({ username, isGoogleLogin: false });
  const banned = await Banned.findOne({ email });

  if (banned) {
    res.status(400);
    throw new Error("You are banned from using the website");
  }

  if (emailExists && usernameExists) {
    res.status(400);
    throw new Error("Email and username are already in use");
  } else if (emailExists) {
    res.status(400);
    throw new Error("Email is already in use");
  } else if (usernameExists) {
    res.status(400);
    throw new Error("Username is already in use");
  }

  if (!validator.matches(username, "^[a-zA-Z0-9_.-]*$")) {
    res.status(400);
    throw new Error(
      "Username can only contain English letters (both uppercase and lowercase), numbers, underscores (_), dots (.), and hyphens (-)"
    );
  }
  if (!validator.isStrongPassword(password)) {
    res.status(400);
    throw new Error("Password is not strong enough");
  }

  const user = await this.create({ username, email, password, role });

  return user;
};

// static login method
userSchema.statics.login = async function (res, username, password) {
  if (!username || !password) {
    res.status(400);
    throw new Error("All fields must be filled");
  }

  const user = await this.findOne({ username, isGoogleLogin: false });
  if (!user) {
    res.status(400);
    throw new Error("Incorrect username or password");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(400);
    throw new Error("Incorrect username or password");
  }
  if (!user.isVerified) {
    res.status(400);
    throw new Error("Please verify your account first");
  }

  return user;
};

userSchema.statics.googleLogin = async function (res, name, email, picture) {
  const banned = await Banned.findOne({ email });

  if (banned) {
    res.status(400);
    throw new Error("You are banned from using the website");
  }

  await this.findOneAndUpdate(
    { email, isGoogleLogin: true },
    { username: name, image: picture },
    { upsert: true }
  );
  const user = await this.findOne({ email, isGoogleLogin: true });

  return user;
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("deleteOne", async function (next) {
  const userId = this.getQuery()._id; // Get the ID of the user being deleted
  if (userId) {
    await User.updateMany(
      {},
      { $pull: { followers: userId, following: userId } }
    );

    // Remove `userId` from `users` array in each notification
    await User.updateMany(
      { "notifications.users": userId },
      { $pull: { "notifications.$[].users": userId } }
    );

    // Remove notifications with empty `users` arrays
    await User.updateMany(
      { "notifications.users": { $size: 0 } }, // Match notifications with empty `users` arrays
      { $pull: { notifications: { users: { $size: 0 } } } } // Remove the notification itself
    );
    const userLikeIds = await Like.find({ user: userId });

    await Like.deleteMany({ user: userId });

    await Article.updateMany(
      { likes: { $in: userLikeIds } }, // Find articles with likes by the user
      { $pull: { likes: { $in: userLikeIds } } } // Remove the like IDs from the likes array
    );

    await Article.updateMany(
      { "comments.user": userId }, // Find articles with comments by the user
      { $pull: { comments: { user: userId } } } // Remove comments made by the user
    );

    await Article.deleteMany({ user: userId });
  }
  next();
});

const User = mongoose.model("User", userSchema);
const Banned = mongoose.model("Banned", bannedSchema);

module.exports = { User, Banned };
