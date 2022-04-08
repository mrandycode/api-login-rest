const Joi = require('joi');

const from = Joi.string();
const to = Joi.string();
const subject = Joi.string();
const text = Joi.string();
const html = Joi.string();
const email = Joi.string().email().max(64);

const sendEmailSchema = Joi.object({
    from: from.required(),
    to: to.required(),
    subject: subject.required(),
    text: text.required(),
    html: html.required(),
});

const emailSchema = Joi.object({
    email: email.required(),
});

module.exports = { sendEmailSchema, emailSchema }