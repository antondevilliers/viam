/**
 *  Error Management
 *
 *
 *
 */
const AppError = require('./../utils/AppError');
// const Email = require('./../utils/email');

/**
 * Handle and DB cast errors.
 * If the imported data does not match DB schema
 * @param {object} err
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

/**
 * Duplicate field errors in the DB
 * @param {object} err
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Handle DB validation errors
 * @param {boject} err
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Invalid JWT Tokens
 */
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

/**
 * Expired JWT Tokens
 * - Reserved.
 */

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

/**
 * Send the full error stack in its original form.
 * @param {object} err
 * @param {object} req
 * @param {object} res
 */

const sendErrorDev = async (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    console.log((err));
    // await new Email('Admin').send(
    //   'errorReport',
    //   `Notification Server Reported Error! ${err.status}`,
    //   `🚨THERE WAS A ERROR DETECTED WITH A STATUS CODE: ${err.status}.🚨`,
    //   err.stack
    // );
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

const sendErrorProd = async (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    await new Email('Admin').send(
      'errorReport',
      `Notification Server Error! ${err.status}`,
      `🚨THERE WAS A ERROR DETECTED WITH A STATUS CODE: ${err.status}.🚨`,
      err.stack
    );
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

/**
 * Main function that handles all incoming errors via the middleware.
 * @param {object} err
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 400;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
