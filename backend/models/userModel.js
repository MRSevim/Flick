const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    isGoogleLogin: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

// static signup method
userSchema.statics.signup = async function (res, username, email, password) {
  // validation
  if (!username || !password || !email) {
    res.status(400);
    throw new Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Email is not valid");
  }

  const emailExists = await this.findOne({ email });
  const usernameExists = await this.findOne({ username });

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

  const user = await this.create({ username, email, password });

  return user;
};

// static login method
userSchema.statics.login = async function (res, username, password) {
  if (!username || !password) {
    res.status(400);
    throw new Error("All fields must be filled");
  }

  const user = await this.findOne({ username });
  if (!user) {
    res.status(400);
    throw new Error("Incorrect username or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(400);
    throw new Error("Incorrect username or password");
  }

  return user;
};

userSchema.statics.googleLogin = async function (res, name, email) {
  const user = await this.findOne({ email });
  const username = await this.findOne({ username: name });

  if (user && !user.isGoogleLogin) {
    res.status(400);
    throw new Error("There is already an account with that email");
  }

  if (username && !username.isGoogleLogin) {
    res.status(400);
    throw new Error(
      `There is already an account with username "${username.username}"`
    );
  }

  await this.findOneAndUpdate(
    { email },
    { username: name, isGoogleLogin: true },
    { upsert: true }
  );
  const newUser = await this.findOne({ email });

  return newUser;
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
