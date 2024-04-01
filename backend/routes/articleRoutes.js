const express = require("express");

// controller functions
const {
  getArticle,
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  deleteMany,
} = require("../controllers/articleController");

const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

//authenticated user get drafts route
router.get("/draft", requireAuth, getArticles(true));

//authenticated user get draft route
router.get("/draft/:id", requireAuth, getArticle(true));

//authenticated user delete many articles route
router.delete("/deleteMany", requireAuth, deleteMany);

//get an article route
router.get("/:id", getArticle(false));

//get all articles of specific user route
router.get("/user/:id", getArticles(false));

router.use(requireAuth);

//authenticated user create article route
router.post("/", createArticle);

//authenticated user update article route
router.patch("/:id", updateArticle);

//authenticated user create article route
router.delete("/:id", deleteArticle);

module.exports = router;
