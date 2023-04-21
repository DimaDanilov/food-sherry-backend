const express = require("express");
const router = express.Router();
const productController = require(`../controller/product.controller`);
const authMiddleware = require(`../middleware/auth.middleware`);

router.post("/product", authMiddleware, productController.createProduct);
router.get("/product", productController.getProducts);
router.get("/product/:id", productController.getOneProduct);
router.put("/product", authMiddleware, productController.updateProduct);
router.delete("/product/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
