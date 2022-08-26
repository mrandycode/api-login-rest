const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  apps: [{
    name: 'api-login-rest',
    script: './index.js',
  }]
}