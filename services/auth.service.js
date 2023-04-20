const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJwt = (id, email, name, surname, phone) => {
  return jwt.sign(
    {
      id: id,
      email: email,
      name: name,
      surname: surname,
      phone: phone,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
};

class AuthService {
  async registration(registerData) {
    const { email, password, name, surname, phone } = registerData;
    if (!email || !password) {
      throw new Error("Некорректный email или password");
    }
    if (!name || !surname || !phone) {
      throw new Error("Введены не все данные");
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
      `INSERT INTO user_account (email, password, name, surname, phone) values ($1, $2, $3, $4, $5) RETURNING id, email, name, surname, phone`,
      [email, hashPassword, name, surname, phone]
    );
    const token = generateJwt(
      user[0].id,
      user[0].email,
      user[0].name,
      user[0].surname,
      user[0].phone
    );

    return token;
  }
  async login(loginData) {
    const { email, password } = loginData;
    const user = await db.query(
      `SELECT id, email, password, name, surname, phone FROM user_account WHERE email = $1`,
      [email]
    );
    if (!user.length) {
      throw new Error("Пользователя с таким email не существует");
    }
    const comparePassword = bcrypt.compareSync(password, user[0].password);
    if (!comparePassword) {
      throw new Error("Неверный пароль");
    }
    const token = generateJwt(
      user[0].id,
      user[0].email,
      user[0].name,
      user[0].surname,
      user[0].phone
    );

    return token;
  }
}

module.exports = new AuthService();
