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
      required: true,
    },
  },
  { timestamps: true }
);

// static signup method
userSchema.statics.signup = async function (username, email, password) {
  // validation
  if (!username || !password || !email) {
    throw new Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }

  const emailExists = await this.findOne({ email });
  const usernameExists = await this.findOne({ username });

  if (emailExists && usernameExists) {
    throw new Error("Email and username are already in use");
  } else if (emailExists) {
    throw new Error("Email is already in use");
  } else if (usernameExists) {
    throw new Error("Username is already in use");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }

  const user = await this.create({ username, email, password });

  return user;
};

// static login method
userSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw new Error("All fields must be filled");
  }

  const user = await this.findOne({ username });
  if (!user) {
    throw new Error("Incorrect username or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Incorrect username or password");
  }

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

module.exports = mongoose.model("User", userSchema);
