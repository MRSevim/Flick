const express = require("express");

// controller functions
const {
  getArticle,
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");

const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

//get an article route
router.get("/:id", getArticle);

//get all articles of specific user route
router.get("/user/:id", getArticles);

router.use(requireAuth);

//authenticated user create article route
router.post("/", createArticle);

//authenticated user update article route
router.patch("/:id", updateArticle);

//authenticated user create article route
router.delete("/:id", deleteArticle);

module.exports = router;
