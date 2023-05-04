const express = require("express");
const router = express.Router();
const userController = require(`../controller/user.controller`);
const authMiddleware = require(`../middleware/auth.middleware`);

router.get("/", userController.getUsers);
router.get("/:id", userController.getOneUser);
router.put("/", authMiddleware, userController.updateUser);
router.put("/avatar", authMiddleware, userController.updateUserAvatar);
router.delete("/avatar/:id", authMiddleware, userController.deleteUserAvatar);

module.exports = router;
