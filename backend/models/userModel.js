const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
require("dotenv").config();

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
      default: `${process.env.BACKEND_URL}/default-user.jpg`,
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

const User = mongoose.model("User", userSchema);
const Banned = mongoose.model("Banned", bannedSchema);

module.exports = { User, Banned };
