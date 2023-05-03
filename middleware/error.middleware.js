const GeneralError = require("../error/GeneralError");

function errorHandler(err, req, res, next) {
  if (err instanceof GeneralError) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({ message: "Unknown error!" });
}

module.exports = errorHandler;
