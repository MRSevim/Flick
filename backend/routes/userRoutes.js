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
  generateModLink,
} = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/register/:token?", signupUser);

// logout route
router.post("/logout", logoutUser);

//generate mod link route
router.get("/generate-mod-link", generateModLink);

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
