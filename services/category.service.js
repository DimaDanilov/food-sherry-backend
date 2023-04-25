const { Category } = require("../models/models");

class CategoryService {
  async getCategories() {
    return await Category.findAll({
      attributes: ["id", "name"],
    });
  }
}

module.exports = new CategoryService();
