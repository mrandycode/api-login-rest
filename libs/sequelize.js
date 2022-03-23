const { Sequelize } = require('sequelize');
const { config } = require('../config/config');
const setupModels = require('../db/models');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `mysql://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const sequelize = new Sequelize(URI, {
    dialect: 'mysql',
    logging: true
});

setupModels(sequelize);
sequelize.sync(); // Con este método de el ORM empieza a crear o modificar los modelos en la BD.

module.exports = sequelize;