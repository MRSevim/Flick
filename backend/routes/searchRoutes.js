const express = require("express");
const {
  getBySearch,
  getByAdvancedSearch,
} = require("../controllers/searchController");

const router = express.Router();

//get articles and users by search route
router.get("/all", getBySearch);

//make advanced search route
router.get("/advanced", getByAdvancedSearch);

module.exports = router;
