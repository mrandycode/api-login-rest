const Joi = require('joi');

const id = Joi.number().integer();
const country = Joi.string().max(4);
const email = Joi.string().email().max(64);
const password = Joi.string()
    .required()
    .min(8);
const recoveryToken = Joi.string();

const loginSchema = Joi.object({
    country: country.required(),
    email: email.required(),
    password: password.required()
});

const registerSchema = Joi.object({
    id: id,
    country: country.required(),
    email: email.required(),
    password: password.required()
});

const newPasswordSchema = Joi.object({
    recoveryToken: recoveryToken.required(),
    password: password.required()
});

module.exports = { loginSchema, registerSchema, newPasswordSchema }
