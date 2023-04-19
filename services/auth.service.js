const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJwt = (id, email) => {
  return jwt.sign({ id: id, email: email }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class AuthService {
  async registration(registerData) {
    const { email, password } = registerData;
    if (!email || !password) {
      throw new Error("Некорректный email или password");
    }
    const candidate = await db.query(
      `SELECT id, email FROM user_account WHERE email = $1`,
      [email]
    );
    if (candidate.length) {
      throw new Error("Пользователь с таким email уже существует");
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await db.query(
      `INSERT INTO user_account (email, password) values ($1, $2) RETURNING id, email`,
      [email, hashPassword]
    );
    const token = generateJwt(user[0].id, user[0].email);

    return token;
  }
  async login(loginData) {
    const { email, password } = loginData;
    const user = await db.query(
      `SELECT id, email, password FROM user_account WHERE email = $1`,
      [email]
    );
    if (!user.length) {
      throw new Error("Пользователя с таким email не существует");
    }
    const comparePassword = bcrypt.compareSync(password, user[0].password);
    if (!comparePassword) {
      throw new Error("Неверный пароль");
    }
    const token = generateJwt(user[0].id, user[0].email);

    return token;
  }
}

module.exports = new AuthService();
