const productService = require("../services/product.service");

class ProductController {
  async createProduct(req, res) {
    const newProduct = await productService.createProduct(
      req.body,
      req.files.images
    );
    res.json(newProduct[0]);
  }
  async getProducts(req, res) {
    const products = await productService.getProducts(
      req.query.search,
      req.query.page
    );
    let total_count = await productService.getTotalCount(req.query.search);
    total_count = parseInt(total_count[0].count);
    res.json({ products, total_count });
  }
  async getOneProduct(req, res) {
    const product = await productService.getOneProduct(req.params.id);
    res.json(product[0]);
  }
  async updateProduct(req, res) {
    const updatedProduct = await productService.updateProduct(
      req.body,
      req.files.images
    );
    res.json(updatedProduct[0]);
  }
  async deleteProduct(req, res) {
    const product = await productService.deleteProduct(req.params.id);
    res.json(product[0]);
  }
}

module.exports = new ProductController();
