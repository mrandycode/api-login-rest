const express = require('express');
const http = require('http');
const UserService = require('./../services/user.service');
const validatorHandler = require('./../middlewares/validator.handler');
const constants = require('../shared/constants');
const utils = require('../shared/utils');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const { createUserSchema,
    getUserByIdSchema,
    getUsersByCountrySchema,
    getUserByEmailSchema,
    updateUserSchema } = require('./../schemas/user.schema');
const { emailSchema } = require('../schemas/email.schema');
const router = express.Router();
const service = new UserService();
const { checkApiKey, checkRoles } = require('../middlewares/auth.handler');
const passport = require('passport');

router.get('/', async (req, res, next) => {
    try {
        const users = await service.find();
        res.json(users);
    } catch (error) {
        next(error);
    }
});

router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    checkApiKey,
    checkRoles('admin', 'customer'),
    validatorHandler(getUserByIdSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const category = await service.findOne(id);
            res.json(category);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/get/email',
    passport.authenticate('jwt', { session: false }),
    checkRoles('admin'),
    validatorHandler(getUserByEmailSchema, 'body'),
    checkApiKey,
    async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await service.findByEmail(email);
            delete user.dataValues.id;
            delete user.dataValues.password;
            delete user.dataValues.recoveryToken;
            delete user.dataValues.role;
            delete user.recoveryToken;
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/by-country/:country',
    validatorHandler(getUsersByCountrySchema, 'params'),
    async (req, res, next) => {
        try {
            const { country } = req.params;
            const user = await service.findByCountry(country);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/create',
    validatorHandler(createUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const newUser = await service.create(body);
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }
);

router.patch('/:id',
    validatorHandler(getUserByIdSchema, 'params'),
    validatorHandler(updateUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = req.body;
            const user = await service.update(id, body);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id',
    validatorHandler(getUserByIdSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await service.delete(id);
            res.status(201).json({ id });
        } catch (error) {
            next(error);
        }
    }
);


router.post('/recovery/password',
    validatorHandler(emailSchema, 'body'),
    checkApiKey,
    async (req, res, next) => {
        try {
            const body = req.body;
            const email = body.email;
            const user = await service.findByEmail(email);

            const payload = {
                sub: user.id
            };

            // se puede crear otro secret para recuperación
            const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
            await service.update(user.id, { recoveryToken: token });
            const bodyEmail = utils.getEmailRecovery(email, user, token, req);

            const options = constants.EMAIL_RECOVERY;
            var postReq = await http.request(options, function (response) {
                response.setEncoding('utf8');
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    res.end(data);
                });

            });
            postReq.write(JSON.stringify(bodyEmail));
            postReq.end();

        } catch (error) {
            next(error);
        }
    });


module.exports = router;

