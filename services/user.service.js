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

  async updateUserAvatar(userData, avatar, userId) {
    const user = await UserAccount.findOne({
      attributes: ["id", "avatar"],
      where: { id: userId },
    });

    if (!user) {
      console.log("THERE IS NO SUCH USER");
    } else if (Number(userData.id) !== userId) {
      console.log("ERROR AUTH");
    } else {
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
  }

  async deleteUserAvatar(requestUserId, authUserId) {
    const user = await UserAccount.findOne({
      attributes: ["id", "avatar"],
      where: { id: authUserId },
    });

    if (!user) {
      console.log("THERE IS NO SUCH USER");
    } else if (Number(requestUserId) !== authUserId) {
      console.log("ERROR AUTH");
    } else {
      if (user.avatar) {
        fileService.deleteFile(user.avatar, "profile_avatars");
      }
      return await UserAccount.update(
        { avatar: null },
        { where: { id: authUserId } }
      );
    }
  }
}

module.exports = new UserService();
