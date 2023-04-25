const authService = require("../services/auth.service");

class AuthController {
  async register(req, res) {
    const token = await authService.register(req.body);
    res.json({ token });
  }

  async login(req, res) {
    const token = await authService.login(req.body);
    res.json({ token });
  }

  async check(req, res) {
    const token = await authService.check(req.user);
    return res.json({ token });
  }
}

module.exports = new AuthController();
