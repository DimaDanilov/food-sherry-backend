const express = require("express");
const router = express.Router();
const productController = require(`../controller/product.controller`);
const authMiddleware = require(`../middleware/auth.middleware`);

router.post("/product", authMiddleware, productController.createProduct);
router.get("/product", productController.getProducts);
router.get("/product/:id", productController.getOneProduct);

router.get(
  "/product_current/:profile_id",
  productController.getCurrentProducts
);
router.get("/product_closed/:profile_id", productController.getClosedProducts);
router.get("/product_taken/:profile_id", productController.getTakenProducts);
router.get(
  "/product_created/:profile_id",
  productController.getCreatedProductsByUser
);

router.put("/product", authMiddleware, productController.updateProduct);
router.put(
  "/product_status",
  authMiddleware,
  productController.updateProductStatus
);
router.delete("/product/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
