const express = require("express");
const requireAuth = require("../middlewares/authMiddleware");
const { like, getMostLiked } = require("../controllers/likeController");

const router = express.Router();

//get most liked articles route
router.get("/getMostLiked/:time", getMostLiked);

router.use(requireAuth);

//authenticated user like a post route
router.post("/:id", like);

module.exports = router;
