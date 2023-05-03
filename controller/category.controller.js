const categoryService = require("../services/category.service");
const GeneralError = require("../error/GeneralError");

class CategoryController {
  async getCategories(req, res, next) {
    try {
      const categories = await categoryService.getCategories();
      return res.json(categories);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }
}

module.exports = new CategoryController();
