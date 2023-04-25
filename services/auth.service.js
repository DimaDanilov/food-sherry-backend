const { UserAccount } = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJwt = (
  id,
  email,
  name,
  surname,
  companyName,
  phone,
  timeCreated
) => {
  return jwt.sign(
    {
      id: id,
      email: email,
      name: name,
      surname: surname,
      company_name: companyName,
      phone: phone,
      time_created: timeCreated,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
};

class AuthService {
  async register(registerData) {
    const { email, password, name, surname, company_name, phone } =
      registerData;
    if (!email || !password) {
      throw new Error("Некорректный email или password");
    }
    if ((!company_name || !phone) && (!name || !surname || !phone)) {
      throw new Error("Введены не все данные");
    }
    const candidate = await UserAccount.findOne({
      attributes: ["id"],
      where: { email },
    });
    if (candidate) {
      throw new Error("Пользователь с таким email уже существует");
    }
    const hashPassword = await bcrypt.hash(password, 5);

    const user = await UserAccount.create({
      name: name,
      surname: surname,
      company_name: company_name,
      phone: phone,
      email: email,
      password: hashPassword,
    });

    return generateJwt(
      user.id,
      user.email,
      user.name,
      user.surname,
      user.company_name,
      user.phone,
      user.time_created
    );
  }

  async login(loginData) {
    const { email, password } = loginData;
    const user = await UserAccount.findOne({
      attributes: [
        "id",
        "email",
        "password",
        "name",
        "surname",
        "company_name",
        "phone",
        "time_created",
      ],
      where: { email },
    });
    if (!user) {
      throw new Error("Пользователя с таким email не существует");
    }
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      throw new Error("Неверный пароль");
    }
    const token = generateJwt(
      user.id,
      user.email,
      user.name,
      user.surname,
      user.company_name,
      user.phone,
      user.time_created
    );

    return token;
  }
  async check(userData) {
    return generateJwt(
      userData.id,
      userData.email,
      userData.name,
      userData.surname,
      userData.company_name,
      userData.phone,
      userData.time_created
    );
  }
}

module.exports = new AuthService();
