const express = require("express");
const router = express.Router();
const { login, dashboard } = require("../controllers/main.js");
const authMiddleware = require("../middleware/auth.js");

router.route("/login").post(login);
// authMiddleware is useful to create a route that requires authentication
// eg: JWT
router.route("/dashboard").get(authMiddleware, dashboard);

module.exports = router;
