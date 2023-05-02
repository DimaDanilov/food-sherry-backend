const userService = require("../services/user.service");

class UserController {
  async getUsers(req, res) {
    const users = await userService.getUsers();
    res.json(users);
  }

  async getOneUser(req, res) {
    const user = await userService.getOneUser(req.params.id);
    res.json(user);
  }

  async updateUser(req, res) {
    const updatedUser = await userService.updateUser(req.body, req.user.id);
    res.json(updatedUser);
  }

  async updateUserAvatar(req, res) {
    const updatedAvatar = await userService.updateUserAvatar(
      req.body,
      req.files.avatar,
      req.user.id
    );
    res.json(updatedAvatar[1].avatar);
  }

  async deleteUserAvatar(req, res) {
    const deletedAvatar = await userService.deleteUserAvatar(
      req.params.id,
      req.user.id
    );
    res.json(deletedAvatar);
  }
}

module.exports = new UserController();
