require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3000,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbHost: process.env.DB_HOST,
    jwtSecret: process.env.JWT_SECRET,
    corsWhiteList: process.env.CORS_WHITE_LIST,
    apiKey: process.env.API_KEY,
    hostEmail: process.env.HOST_EMAIL,
    portEmail: process.env.PORT_EMAIL,
};

module.exports = { config };