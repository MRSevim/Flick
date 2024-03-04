const express = require("express");
const requireAuth = require("../middlewares/authMiddleware");
const {
  like,
  getWeekly,
  getMonthly,
  getYearly,
} = require("../controllers/likeController");

const router = express.Router();

//get most liked posts of the week route
router.get("/getWeekly", getWeekly);
//get most liked posts of the month route
router.get("/getMonthly", getMonthly);
//get most liked posts of the year route
router.get("/getYearly", getYearly);

router.use(requireAuth);

//authenticated user like a post route
router.post("/:id", like);

module.exports = router;
