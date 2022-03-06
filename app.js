const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

// Routes
const balanceRoutes = require('./routes/balanceRoutes');
const profileRoutes = require('./routes/profileRouter');
const gameRoutes = require('./routes/gameRouter');
const rewardRoutes = require('./routes/rewardsRouter');


// initialize Express
const app = express();


app.use(express.json({limit: '10mb'}));


// GLOBAL MIDDLEWARE:
//-----------------------------------start---
app.all('/', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

/*
 * Set security HTTP headers
 **/

  app.use(helmet());

/**
 * Development Logging - server console
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use(morgan(':date[clf]'));
}

/**
 *  Body Parse, reading data from body into req.body
 */
app.use(express.json());

/**
 *  Data sanitization against XSS
 */
app.use(xss());

/**
 *  Prevent parameter pollution
 */
app.use(
  hpp({
    whitelist: [
      // reserved
    ],
  })
);

/**
 *  Test Middleware functionality
 *  - Reserved for other features...
 */
app.use((req, res, next) => {
  // console.log(req.headers);
  next();
});

/**
 * API Route handlers - Middleware
 */
app.use('/api/v1/balances', balanceRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/rewards', rewardRoutes);

/**
 * Throw Error on all routes not defines.
 * @param {object} * - all not defined routes.
 */
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/**
 * Global Error Middleware handler
 * Instead of using Try, Catch, pass returned Promise > Next() error Middleware.
 */
app.use(globalErrorHandler);

// GLOBAL MIDDLEWARE:
//-----------------------------------end---

module.exports = app;
