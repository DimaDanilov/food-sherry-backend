const { UserAccount } = require("../models/models");

class UserService {
  async getUsers() {
    return await UserAccount.findAll({
      attributes: [
        "id",
        "email",
        "name",
        "surname",
        "company_name",
        "phone",
        "time_created",
      ],
    });
  }
  async getOneUser(userId) {
    return await UserAccount.findOne({
      attributes: [
        "id",
        "email",
        "name",
        "surname",
        "company_name",
        "phone",
        "time_created",
      ],
      where: { id: userId },
    });
  }
}

module.exports = new UserService();
