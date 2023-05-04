const express = require("express");
const router = express.Router();
const productRouter = require("./product.routes");
const categoryRouter = require("./category.routes");
const authRouter = require("./auth.routes");
const userRouter = require("./user.routes");

router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);

module.exports = router;
