const express = require("express");

// controller functions
const {
  getArticle,
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  deleteMany,
  getSimilar,
  getFeatured,
  getAll,
} = require("../controllers/articleController");

const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

//authenticated user get drafts route
router.get("/draft", requireAuth, getArticles(true));

//authenticated user get draft route
router.get("/draft/:id", requireAuth, getArticle(true));

//authenticated user delete many articles route
router.delete("/deleteMany", requireAuth, deleteMany);

//get all articles of specific user route
router.get("/user/:id", getArticles(false));

//get similar articles route
router.get("/similar/:id", getSimilar);

//get featured articles route
router.get("/featured", getFeatured);

//get all articles route
router.get("/all", getAll);

//get an article route
router.get("/:id", getArticle(false));

router.use(requireAuth);

//authenticated user create article route
router.post("/", createArticle);

//authenticated user update article route
router.patch("/:id", updateArticle);

//authenticated user delete article route
router.delete("/:id", deleteArticle);

module.exports = router;
