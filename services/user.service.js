const fileService = require("../services/file.service");
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
        "avatar",
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
        "avatar",
        "time_created",
      ],
      where: { id: userId },
    });
  }
  async updateUser(userData, userId) {
    const user = await UserAccount.findOne({
      attributes: ["id"],
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User with the specified ID was not found");
    }
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

  async updateUserAvatar(avatar, userId) {
    const user = await UserAccount.findOne({
      attributes: ["id", "avatar"],
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User with the specified ID was not found");
    }
    if (user.avatar) {
      fileService.deleteFile(user.avatar, "profile_avatars");
    }
    const fileName = fileService.saveFile(avatar, "profile_avatars");
    return await UserAccount.update(
      {
        avatar: fileName,
      },
      {
        where: { id: userId },
        returning: true,
        plain: true,
      }
    );
  }

  async deleteUserAvatar(userId) {
    const user = await UserAccount.findOne({
      attributes: ["id", "avatar"],
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User with the specified ID was not found");
    }
    if (!user.avatar) {
      throw new Error("There is no avatar for this user");
    }
    fileService.deleteFile(user.avatar, "profile_avatars");
    return await UserAccount.update(
      { avatar: null },
      { where: { id: userId } }
    );
  }
}

module.exports = new UserService();
