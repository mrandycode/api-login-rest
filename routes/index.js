const express = require('express');
const authRouter = require('./auth.router');
const userRouter = require('./users.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api-login-rest', router);
    router.use('/auth', authRouter);
    router.use('/users', userRouter);
}

module.exports = routerApi;
