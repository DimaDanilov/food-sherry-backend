const userService = require("../services/user.service");

class UserController {
  async getUsers(req, res) {
    const users = await userService.getUsers();
    res.json(users);
  }
  async getOneUser(req, res) {
    const users = await userService.getOneUser(req.params.id);
    res.json(users[0]);
  }
}

module.exports = new UserController();
