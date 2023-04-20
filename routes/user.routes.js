const express = require("express");
const router = express.Router();
const userController = require(`../controller/user.controller`);

router.get("/user", userController.getUsers);
router.get("/user/:id", userController.getOneUser);

module.exports = router;
