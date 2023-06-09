const express = require("express");
const router = express.Router();
const authController = require(`../controller/auth.controller`);
const authMiddleware = require(`../middleware/auth.middleware`);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/check", authMiddleware, authController.check);

module.exports = router;
