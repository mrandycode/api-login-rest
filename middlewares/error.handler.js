const utilsShared = require('../shared/utils');

function logErrors(err, req, res, next) {
  console.error(err);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: req.t(err.message),
    stack: err.stack,
  });
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    err = utilsShared.translateBoom(err, req);
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

function ormErrorHandler(err, req, res, next) {
  if (err) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: utilsShared.getErrorByPathOrm(err.errors, req)
    });
  }
  next(err);
}

module.exports = { logErrors, errorHandler, boomErrorHandler, ormErrorHandler };