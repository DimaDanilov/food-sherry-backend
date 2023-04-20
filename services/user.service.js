const db = require("../db");

class UserService {
  async getUsers() {
    return db.query(
      `SELECT id, email, name, surname, phone, company_name FROM user_account ORDER BY id`
    );
  }
  async getOneUser(userId) {
    return db.query(
      `SELECT id, email, name, surname, phone, company_name FROM user_account WHERE id = $1`,
      [userId]
    );
  }
}

module.exports = new UserService();
