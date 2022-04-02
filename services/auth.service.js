const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');


class AuthService {
    constructor() {
        this.client = models;
    }


    async find() {
        const message = await this.client.Contact.findAll();
        return message;
    }
}