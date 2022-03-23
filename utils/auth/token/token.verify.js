const jwt = require('jsonwebtoken');
const { config } = require('../../../config/config');
const secret = config.jwtSecret; 

function verifyToken(token, secret) {
    return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
