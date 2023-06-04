const fileService = require("../services/file.service");
const { UserAccount } = require("../models/models");
const { Op } = require("sequelize");
var Sequelize = require("sequelize");

const USERS_ON_SEARCH_PAGE = 8;

class UserService {
  async getUsers(searchQuery, pageQuery) {
    return await UserAccount.findAndCountAll({
      attributes: ["id", "name", "surname", "company_name", "avatar"],
      where: {
        [Op.and]: [
          searchQuery && {
            [Op.or]: [
              { company_name: { [Op.iLike]: `%${searchQuery}%` } },
              {
                [Op.and]: [
                  Sequelize.where(
                    Sequelize.fn(
                      "concat",
                      Sequelize.col("name"),
                      " ",
                      Sequelize.col("surname")
                    ),
                    { [Op.iLike]: `%${searchQuery}%` }
                  ),
                ],
              },
              {
                [Op.and]: [
                  Sequelize.where(
                    Sequelize.fn(
                      "concat",
                      Sequelize.col("surname"),
                      " ",
                      Sequelize.col("name")
                    ),
                    { [Op.iLike]: `%${searchQuery}%` }
                  ),
                ],
              },
            ],
          },
        ],
      },
      limit: Number(pageQuery) ? USERS_ON_SEARCH_PAGE : undefined,
      offset: Number(pageQuery)
        ? USERS_ON_SEARCH_PAGE * (pageQuery - 1)
        : undefined,
      order: [["time_created", "DESC"]],
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
    const fileName = await fileService.saveFile(
      avatar,
      "avatars",
      "avatar",
      userId
    );
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
    fileService.deleteFile("avatars", "avatar", userId);
    return await UserAccount.update(
      { avatar: null },
      { where: { id: userId } }
    );
  }
}

module.exports = new UserService();
