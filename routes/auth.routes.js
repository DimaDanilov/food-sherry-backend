const express = require("express");
const router = express.Router();
const authController = require(`../controller/auth.controller`);
const authMiddleware = require(`../middleware/auth.middleware`);

router.post("/register", authController.registration);
router.post("/login", authController.login);
router.get("/auth", authMiddleware, authController.check);

module.exports = router;
