const express = require("express");
const requireAuth = require("../middlewares/authMiddleware");
const {
  followUser,
  getFollowers,
  getFollowing,
} = require("../controllers/followController");

const router = express.Router();

//get all followers route
router.get("/followers/:id", getFollowers);
//get all following route
router.get("/followings/:id", getFollowing);

//follow route
router.post("/:id", requireAuth, followUser);

module.exports = router;
