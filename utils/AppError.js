/**
 * New Error Object, Extends on the default Error Object to handle global errors via global middleware.
 * @class AppError
 * @extends Error
 * @constructor
 * @param {string} message - The Error message.
 * @param {integer} statusCode - The RES status code.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
