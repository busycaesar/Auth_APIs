const router = require("../router");

// Authentication APIs
router.use("/auth", require("./auth"));

// User Information APIs.
router.use("/user", require("./user"));

module.exports = router;
