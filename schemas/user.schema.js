const Joi = require('joi');

const id = Joi.number().integer();
const country = Joi.string().max(4);
const name = Joi.string().max(100);
const lastName = Joi.string().max(100);
const email = Joi.string().email().max(64);
const password = Joi.string()
    .required()
    .min(8);
const role = Joi.string().min(5);


const getUserByIdSchema = Joi.object({
    id: id.required()
});

const getUserByEmailSchema = Joi.object({
    email: email.required()
});

const getUsersByCountrySchema = Joi.object({
    country: country.required()
});

const createUserSchema = Joi.object({
    country: country.required(),
    name: name.required(),
    lastName: lastName.required(),
    email: email.required(),
    password: password.required(),
    role: role.required()
});

const updateUserSchema = Joi.object({
    password: password,
    role: role,
});


module.exports = {
    createUserSchema,
    updateUserSchema,
    getUserByIdSchema,
    getUsersByCountrySchema,
    getUserByEmailSchema
}