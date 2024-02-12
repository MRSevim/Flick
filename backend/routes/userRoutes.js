const express = require("express");
const requireAuth = require("../middlewares/authMiddleware");

// controller functions
const {
  loginUser,
  signupUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getPublicUser,
} = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/register", signupUser);

// logout route
router.post("/logout", logoutUser);

//get public user profile
router.get("/profile/:username", getPublicUser);

//get, update and delete profile routes
router
  .route("/profile")
  .get(requireAuth, getUserProfile)
  .put(requireAuth, updateUserProfile)
  .delete(requireAuth, deleteUser);

module.exports = router;
