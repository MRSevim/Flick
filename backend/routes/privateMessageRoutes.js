const express = require("express");

// controller functions
const {
  sendPm,
  getPms,
  deletePm,
  deleteMany,
  markAsRead,
} = require("../controllers/privateMessageController");

const requireAuth = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(requireAuth);

//send pm route
router.put("/send/:id", sendPm);

//get pms route
router.get("/", getPms);

//delete mayn pms route
router.delete("/deleteMany", deleteMany);

//mark as read route
router.post("/read", markAsRead);

//delete pm route
router.post("/:id", deletePm);

module.exports = router;
