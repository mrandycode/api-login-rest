const Joi = require('joi');

const id = Joi.number().integer();
const country = Joi.string().max(4);
const email = Joi.string().email().max(64);
const password = Join.string()
    .minOfSpecialCharacters(1)
    .minOfUppercase(1)
    .noWhiteSpaces();

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

