const categoryService = require("../services/category.service");

class CategoryController {
  async getCategories(req, res) {
    const categories = await categoryService.getCategories();
    res.json(categories);
  }
}

module.exports = new CategoryController();
