const utilsShared = require('../shared/utils');
const { TokenExpiredError } = require('jsonwebtoken');

const logErrors = (err, req, res, next) => {
  console.error(err);
  next(err);
}

const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    message: req.t(err.message),
    stack: err.stack,
  });
}

const boomErrorHandler = (err, req, res, next) => {
  if (err.isBoom) {
    err = utilsShared.translateBoom(err, req);
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

const ormErrorHandler = (err, req, res, next) => {
  if (err) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: utilsShared.getErrorByPathOrm(err.errors, req)
    });
  }
  next(err);
}

const jsonWebtoken = (err, req, res, next) => {
  if (err instanceof TokenExpiredError) {
    res.status(401).json({
      message: req.t('TOKEN_EXPIRED')
    })
  }
  next(err);
}

module.exports = {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
  jsonWebtoken
};