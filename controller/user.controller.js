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
}

module.exports = new UserController();
