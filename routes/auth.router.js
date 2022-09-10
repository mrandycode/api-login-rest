const express = require('express');
const http = require('http');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { newPasswordSchema } = require('../schemas/auth.schema');
const validatorHandler = require('./../middlewares/validator.handler');
const constants = require('../shared/constants');
const { config } = require('../config/config');
const UserService = require('../services/user.service');
const { checkApiKey } = require('../middlewares/auth.handler');
const router = express.Router();
const service = new UserService();

router.post('/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {

      const user = req.user;
      const payload = {
        sub: user.id,
        role: user.role
      }
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '30min' });
      delete user.dataValues.recoveryToken;
      await validateIsDoctor(req, res, user, token);

    } catch (error) {
      next(error);
    }
  });

router.post('/change-password',
  checkApiKey,
  validatorHandler(newPasswordSchema, 'body'),
  async (req, res, next) => {
    try {
      const { recoveryToken, password } = req.body;

      const response = await service.changePassword(recoveryToken, password);
      if (!response) {
        res.status(201).json({ message: req.t('CHANGE_PASSWORD_SUCCESS') });
      } else {
        res.status(401).json({ message: req.t('UNAUTHORIZED') });
      }

    } catch (error) {
      next(error);
    }
  }
);

const validateIsDoctor = async (req, res, user, token) => {
  let isDoctorNew = false;
  
  if (user.role === 'doctor') {
    let doctorProfile = {};
    let options = constants.DOCTOR_ROUTER;
    const userId = user.id;
    const path = '/api-core-rest/doctor-profile/user-id/';
    options.headers.Authorization = `Bearer ${token}`;
    options.path = `${path}${userId}`

    await http.get(options, function (response) {
      let body = '';
      response.on('data', function (chunk) {
        body += chunk;
      });
      response.on('end', () => {
        doctorProfile = JSON.parse(body);
        if (doctorProfile && doctorProfile.id > 0) {
          isDoctorNew = false;
        } else {
          isDoctorNew = true;
        }
        res.json({ user, token, isDoctorNew });
      });
    }).on('error', function (e) {
      console.warn("Got error: " + e.message);
    }).end();

  } else {
    return { user, token, isDoctorNew };
  }
}

module.exports = router;