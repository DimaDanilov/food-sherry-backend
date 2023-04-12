const db = require("../db");

class CategoryService {
  async getCategories() {
    return db.query(`SELECT * FROM category`);
  }
}

module.exports = new CategoryService();
