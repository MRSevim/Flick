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
  toggleUserVariables,
} = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/register", signupUser);

// logout route
router.post("/logout", logoutUser);

//get, update and delete profile routes
router
  .route("/profile")
  .get(requireAuth, getUserProfile)
  .put(requireAuth, updateUserProfile)
  .delete(requireAuth, deleteUser);

//get public user profile route
router.get("/:id", getPublicUser);

router.use(requireAuth);

//toggle user variables route
router.put("/toggle/:type", toggleUserVariables);

module.exports = router;
