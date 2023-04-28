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
  async updateUser(userData, userId) {
    if (Number(userData.id) !== userId) {
      console.log("ERROR AUTH");
    } else {
      const user = await UserAccount.findOne({
        attributes: ["id"],
        where: { id: userId },
      });
      if (!user) {
        console.log("THERE IS NO SUCH USER");
      } else {
        return await UserAccount.update(
          {
            name: userData.name,
            surname: userData.surname,
            company_name: userData.company_name,
            phone: userData.phone,
            email: userData.email,
          },
          {
            where: { id: userId },
          }
        );
      }
    }
  }
}

module.exports = new UserService();
