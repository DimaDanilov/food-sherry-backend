const productService = require("../services/product.service");
const GeneralError = require("../error/GeneralError");

class ProductController {
  async createProduct(req, res, next) {
    try {
      if (
        !req.body.title ||
        !req.body.category_id ||
        !req.body.description ||
        !req.body.amount ||
        !req.body.time_to_take ||
        !req.body.location ||
        !req.body.status
      ) {
        return next(GeneralError.badRequest("You didn't add all data"));
      }
      if (req.body.category_id && !(Number(req.body.category_id) > 0)) {
        return next(GeneralError.badRequest("Category should be more than 0"));
      }
      if (!req.files?.images) {
        return next(GeneralError.badRequest("You didn't upload pictures"));
      }
      const newProduct = await productService.createProduct(
        req.body,
        req.files.images,
        req.user.id
      );
      res.json(newProduct);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }

  async getProducts(req, res, next) {
    try {
      if (req.query.page && !(Number(req.query.page) > 0)) {
        return next(GeneralError.badRequest("Page should be more than 0"));
      }
      if (
        req.query.status &&
        req.query.status !== "open" &&
        req.query.status !== "reserved" &&
        req.query.status !== "closed"
      ) {
        return next(
          GeneralError.badRequest("Status should be open, reserved or closed")
        );
      }
      if (
        req.query.sort &&
        req.query.sort !== "datedown" &&
        req.query.sort !== "dateup"
      ) {
        return next(
          GeneralError.badRequest("Sort should be datedown or dateup")
        );
      }

      const CategoriesList =
        req.query.categories &&
        (Array.isArray(req.query.categories)
          ? req.query.categories // If array
          : req.query.categories // If it's only one item
          ? [req.query.categories]
          : []); // If no items

      const productsAndCount = await productService.getProducts(
        req.query.search,
        req.query.page,
        req.query.status,
        req.query.sort,
        CategoriesList
      );
      return res.json(productsAndCount);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }

  async getOneProduct(req, res, next) {
    try {
      const product = await productService.getOneProduct(req.params.id);
      return res.json(product);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }

  async getUserProducts(req, res, next) {
    try {
      if (!Number(req.params.profile_id > 0)) {
        return next(
          GeneralError.badRequest("Profile id should be more than 0")
        );
      }
      if (req.query.page && !(Number(req.query.page) > 0)) {
        return next(GeneralError.badRequest("Page should be more than 0"));
      }
      if (
        req.query.filter !== "taken" &&
        req.query.filter !== "closed" &&
        req.query.filter !== "current"
      ) {
        return next(GeneralError.badRequest("Filter is not valid"));
      }
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
      return res.json(productsAndCount);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }

  async getProductsCountByUser(req, res, next) {
    try {
      if (!Number(req.params.profile_id > 0)) {
        return next(
          GeneralError.badRequest("Profile id should be more than 0")
        );
      }
      const count = await productService.getProductsCountByUser(
        req.params.profile_id
      );
      return res.json(count);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }

  async updateProduct(req, res, next) {
    try {
      if (!req.body.id || !(Number(req.body.id) > 0)) {
        return next(GeneralError.badRequest("Product id is invalid"));
      }
      if (req.body.category_id && !(Number(req.body.category_id) > 0)) {
        return next(GeneralError.badRequest("Category should be more than 0"));
      }
      const updatedProduct = await productService.updateProduct(
        req.body,
        req.user.id
      );
      return res.json(updatedProduct);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }

  async updateProductStatus(req, res, next) {
    try {
      if (!req.body.id || !(Number(req.body.id) > 0)) {
        return next(GeneralError.badRequest("Product id is invalid"));
      }
      const updatedProduct = await productService.updateProductStatus(
        req.body,
        req.user.id
      );
      return res.json(updatedProduct);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }

  async deleteProduct(req, res, next) {
    try {
      if (!Number(req.params.id > 0)) {
        return next(
          GeneralError.badRequest("Product id should be more than 0")
        );
      }
      const deletedproduct = await productService.deleteProduct(
        req.params.id,
        req.user.id
      );
      return res.json(deletedproduct);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }
}

module.exports = new ProductController();
