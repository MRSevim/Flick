const express = require("express");
const {
  getNotifications,
  clearNotifications,
  markAsRead,
} = require("../controllers/notificationController");
const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(requireAuth);

//get notifications route
router.get("/", getNotifications);

//clear notifications route
router.post("/clear", clearNotifications);

//mark as read route
router.post("/read", markAsRead);

module.exports = router;
