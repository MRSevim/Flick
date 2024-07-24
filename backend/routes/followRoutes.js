const express = require("express");
const requireAuth = require("../middlewares/authMiddleware");
const { followUser, getFollows } = require("../controllers/followController");

const router = express.Router();

//get all followers/following route
router.get("/follows/:id", getFollows);

//follow route
router.post("/:id", requireAuth, followUser);

module.exports = router;
