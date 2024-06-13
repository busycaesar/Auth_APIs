const express = require("express");
const router = express.Router();

// Authentication APIs
router.use("/auth", require("./auth"));

// User Information APIs.
router.use("/user", require("./user"));

module.exports = router;
