const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");

const generateJwt = (id, email, name, surname, company_name, phone) => {
  return jwt.sign(
    {
      id: id,
      email: email,
      name: name,
      surname: surname,
      company_name: company_name,
      phone: phone,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
};

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
    const token = generateJwt(
      req.user.id,
      req.user.email,
      req.user.name,
      req.user.surname,
      req.user.company_name,
      req.user.phone
    );
    return res.json({ token });
  }
}

module.exports = new AuthController();
