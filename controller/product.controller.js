const productService = require("../services/product.service");

class ProductController {
  async createProduct(req, res) {
    const newProduct = await productService.createProduct(
      req.body,
      req.files.images,
      req.user.id
    );
    res.json(newProduct);
  }

  async getProducts(req, res) {
    const productsAndCount = await productService.getProducts(
      req.query.search,
      req.query.page,
      req.query.status,
      req.query.sort
    );
    res.json(productsAndCount);
  }

  async getOneProduct(req, res) {
    const product = await productService.getOneProduct(req.params.id);
    res.json(product);
  }

  async getUserProducts(req, res) {
    const filterMap = {
      taken: { statuses: ["reserved", "closed"], userRole: "client_id" },
      closed: { statuses: ["closed"], userRole: "author_id" },
      current: { statuses: ["open", "reserved"], userRole: "author_id" },
    };
    const { statuses, userRole } = filterMap[req.query.filter] || {};
    const productsAndCount = await productService.getUserProducts(
      req.params.profile_id,
      req.query.page,
      statuses,
      userRole
    );
    res.json(productsAndCount);
  }

  async getProductsCountByUser(req, res) {
    const count = await productService.getProductsCountByUser(
      req.params.profile_id
    );
    res.json(count);
  }

  async updateProduct(req, res) {
    const updatedProduct = await productService.updateProduct(
      req.body,
      req.files.images,
      req.user.id
    );
    res.json(updatedProduct);
  }

  async updateProductStatus(req, res) {
    const updatedProduct = await productService.updateProductStatus(
      req.body,
      req.user.id
    );
    res.json(updatedProduct);
  }

  async deleteProduct(req, res) {
    const deletedproduct = await productService.deleteProduct(
      req.params.id,
      req.user.id
    );
    res.json(deletedproduct);
  }
}

module.exports = new ProductController();
