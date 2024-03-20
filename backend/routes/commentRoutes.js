const express = require("express");
const {
  comment,
  edit,
  deleteComment,
} = require("../controllers/commentController");
const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(requireAuth);

//get, update and delete comment routes
router.route("/:id").post(comment).put(edit).delete(deleteComment);

module.exports = router;
