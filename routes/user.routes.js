const express = require("express");
const router = express.Router();
const userController = require(`../controller/user.controller`);
const authMiddleware = require(`../middleware/auth.middleware`);

router.get("/user", userController.getUsers);
router.get("/user/:id", userController.getOneUser);
router.put("/user", authMiddleware, userController.updateUser);

module.exports = router;
