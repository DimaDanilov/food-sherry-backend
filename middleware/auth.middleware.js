const jwt = require("jsonwebtoken");
const GeneralError = require("../error/GeneralError");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Bearer(0) token(1)
    if (!token) {
      return next(GeneralError.unauthorized("Не авторизован"));
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    next(GeneralError.unauthorized("Не авторизован"));
  }
};
