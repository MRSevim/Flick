const express = require("express");

// controller functions
const {} = require("../controllers/articlesController");

const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(requireAuth);

module.exports = router;
