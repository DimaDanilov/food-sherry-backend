const express = require("express");
const router = express.Router();
const productController = require(`../controller/product.controller`);
const authMiddleware = require(`../middleware/auth.middleware`);

router.get("/", productController.getProducts);
router.get("/:id", productController.getOneProduct);
router.post("/", authMiddleware, productController.createProduct);
router.put("/", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

router.get("/user_products/:profile_id", productController.getUserProducts);
router.get(
  "/user_products_total/:profile_id",
  productController.getProductsCountByUser
);

router.put("/status", authMiddleware, productController.updateProductStatus);

module.exports = router;
