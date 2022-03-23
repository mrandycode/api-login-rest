const jwt = require('jsonwebtoken');
const { config } = require('../../../config/config');
const secret = config.jwtSecret; 

function signToken(payload, secret) {
  return jwt.sign(payload, secret);
}

const token = signToken(payload, secret);

module.exports = token;