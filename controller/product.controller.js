const productService = require("../services/product.service");

class ProductController {
  async createProduct(req, res) {
    const newProduct = await productService.createProduct(
      req.body,
      req.files.images,
      req.user.id
    );
    res.json(newProduct[0]);
  }
  async getProducts(req, res) {
    const products = await productService.getProducts(
      req.query.search,
      req.query.page,
      req.query.status
    );
    let total_count = await productService.getTotalCount(
      req.query.search,
      req.query.status
    );
    total_count = parseInt(total_count[0].count);
    res.json({ products, total_count });
  }
  async getOneProduct(req, res) {
    const products = await productService.getOneProduct(req.params.id);
    res.json(products[0]);
  }
  async getUserProducts(req, res) {
    let statuses;
    let userRole;
    switch (req.query.filter) {
      case "taken":
        statuses = "'reserved','closed'";
        userRole = "client_id";
        break;
      case "closed":
        statuses = "'closed'";
        userRole = "author_id";
        break;
      case "current":
        statuses = "'open', 'reserved'";
        userRole = "author_id";
        break;
      default:
        break;
    }
    const products = await productService.getUserProducts(
      req.params.profile_id,
      req.query.page,
      statuses,
      userRole
    );
    let total_count = await productService.getUserProductsTotalCount(
      req.params.profile_id,
      statuses,
      userRole
    );
    total_count = parseInt(total_count[0].count);
    res.json({ products, total_count });
  }
  async getCreatedProductsByUser(req, res) {
    const products = await productService.getCreatedProductsByUser(
      req.params.profile_id
    );
    res.json(products[0]);
  }
  async updateProduct(req, res) {
    const updatedProduct = await productService.updateProduct(
      req.body,
      req.files.images,
      req.user.id
    );
    res.json(updatedProduct[0]);
  }
  async updateProductStatus(req, res) {
    const updatedProduct = await productService.updateProductStatus(
      req.body,
      req.user.id
    );
    res.json(updatedProduct[0]);
  }
  async deleteProduct(req, res) {
    const product = await productService.deleteProduct(
      req.params.id,
      req.user.id
    );
    res.json(product[0]);
  }
}

module.exports = new ProductController();
