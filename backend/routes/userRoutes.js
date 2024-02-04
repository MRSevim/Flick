const express = require("express");
const requireAuth = require("../middlewares/authMiddleware");

// controller functions
const {
  loginUser,
  signupUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/register", signupUser);

// logout route
router.post("/logout", logoutUser);

//get and update userProfile routes
router
  .route("/profile")
  .get(requireAuth, getUserProfile)
  .put(requireAuth, updateUserProfile);

module.exports = router;
