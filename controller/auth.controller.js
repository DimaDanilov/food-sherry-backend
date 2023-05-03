const authService = require("../services/auth.service");
const GeneralError = require("../error/GeneralError");

class AuthController {
  async register(req, res, next) {
    try {
      const token = await authService.register(req.body);
      return res.json({ token });
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }

  async login(req, res, next) {
    try {
      const token = await authService.login(req.body);
      return res.json({ token });
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }

  async check(req, res, next) {
    try {
      const token = await authService.check(req.user);
      return res.json({ token });
    } catch (e) {
      return next(GeneralError.badRequest(e.message));
    }
  }
}

module.exports = new AuthController();
