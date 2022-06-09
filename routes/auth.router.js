const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { newPasswordSchema } = require('../schemas/auth.schema');
const validatorHandler = require('./../middlewares/validator.handler');
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
      res.json({ user, token });
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

module.exports = router;