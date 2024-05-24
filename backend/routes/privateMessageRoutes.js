const express = require("express");

// controller functions
const {
  sendPm,
  getPms,
  deletePm,
  deleteMany,
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

//delete pm route
router.delete("/:id", deletePm);

module.exports = router;
