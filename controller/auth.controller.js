const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");

const generateJwt = (id, email) => {
  return jwt.sign({ id: id, email: email }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class AuthController {
  async registration(req, res) {
    const token = await authService.registration(req.body);
    res.json({ token });
  }
  async login(req, res) {
    const token = await authService.login(req.body);
    res.json({ token });
  }
  async check(req, res) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  }
}

module.exports = new AuthController();
