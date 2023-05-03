class GeneralError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static unauthorized(message) {
    return new GeneralError(401, message);
  }

  static forbidden(message) {
    return new GeneralError(403, message);
  }

  static badRequest(message) {
    return new GeneralError(404, message);
  }

  static internal(message) {
    return new GeneralError(500, message);
  }
}

module.exports = GeneralError;
