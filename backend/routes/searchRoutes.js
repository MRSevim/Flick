const express = require("express");
const { getBySearch } = require("../controllers/searchController");

const router = express.Router();

//get articles and users by search route
router.get("/all", getBySearch);

module.exports = router;
