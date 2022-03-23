const express = require('express');
const UserService = require('./../services/user.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { createUserSchema, getUserByIdSchema, getUsersByCountrySchema, getUserByEmailSchema, updateUserSchema } = require('./../schemas/user.schema');
const router = express.Router();
const service = new UserService();
const  { checkApiKey, checkRoles } = require('../middlewares/auth.handler');
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
    checkRoles('admin', 'user'),
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

router.get('/by-email/:email',
    validatorHandler(getUserByEmailSchema, 'params'),
    async (req, res, next) => {
        try {
            const { email } = req.params;
            const user = await service.findByEmail(email);
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

module.exports = router;

