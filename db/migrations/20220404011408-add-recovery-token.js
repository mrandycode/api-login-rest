'use strict';
const { UserSchema, USERS_TABLE } = require('./../models/user.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(USERS_TABLE, 'recovery_token', UserSchema.recoveryToken);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(USERS_TABLE, 'recovery_token', UserSchema);
  }
};
