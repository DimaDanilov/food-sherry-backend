const userService = require("../services/user.service");
const GeneralError = require("../error/GeneralError");

class UserController {
  async getUsers(req, res, next) {
    try {
      if (req.query.page && !(Number(req.query.page) > 0)) {
        return next(GeneralError.badRequest("Page should be more than 0"));
      }
      const users = await userService.getUsers(
        req.query.search,
        req.query.page
      );
      return res.json(users);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }

  async getOneUser(req, res, next) {
    try {
      if (Number(req.params.id) <= 0) {
        return next(GeneralError.badRequest("User id should be more than 0"));
      }
      const user = await userService.getOneUser(req.params.id);
      return res.json(user);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }

  async updateUser(req, res, next) {
    try {
      if (!Number(req.body.id > 0)) {
        return next(GeneralError.badRequest("User id should be more than 0"));
      }
      if (Number(req.body.id) !== req.user.id) {
        return next(GeneralError.forbidden("You are logged in as wrong user"));
      }
      const updatedUser = await userService.updateUser(req.body, req.user.id);
      return res.json(updatedUser);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }

  async updateUserAvatar(req, res, next) {
    try {
      if (!Number(req.body.id > 0)) {
        return next(GeneralError.badRequest("User id should be more than 0"));
      }
      if (Number(req.body.id) !== req.user.id) {
        return next(GeneralError.forbidden("You are logged in as wrong user"));
      }
      if (!req.body.avatar) {
        return next(GeneralError.badRequest("You didn't upload a picture"));
      }
      const updatedAvatar = await userService.updateUserAvatar(
        req.body.avatar,
        req.user.id
      );
      return res.json(updatedAvatar[1].avatar);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }

  async deleteUserAvatar(req, res, next) {
    try {
      if (Number(req.params.id) !== req.user.id) {
        return next(GeneralError.forbidden("You are logged in as wrong user"));
      }
      if (Number(req.params.id) <= 0) {
        return next(GeneralError.badRequest("User id should be more than 0"));
      }
      const deletedAvatar = await userService.deleteUserAvatar(req.user.id);
      return res.json(deletedAvatar);
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }
}

module.exports = new UserController();
