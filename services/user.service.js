const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('./../libs/sequelize');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config');
const { TokenExpiredError } = require('jsonwebtoken');

class UserService {

    constructor() { }

    async create(data) {
        const hash = await bcrypt.hash(data.password, 10);
        const newUser = await models.User.create({ ...data, password: hash });
        delete newUser.dataValues.password;
        return newUser;
    }

    async find() {
        const rta = await models.User.findAll({
            // include: ['customer']
        });
        rta.map(r => {
            delete r.dataValues.password;
            delete r.dataValues.recoveryToken;
        });
        return rta;
    }

    async findOne(id) {
        return await models.User.findByPk(id).then((user) => {
            delete user.dataValues.password;
            delete user.dataValues.recoveryToken;
            return user;
        }).catch(() => {
            throw boom.unauthorized('USER_NOT_FOUND');
        });
    }

    async findByEmail(email) {
        // return await models.User.findOne({
        //     where: { email }
        // }).then((user) => {
        //     return user;
        // }).catch(() => {
        //     throw boom.unauthorized('USER_NOT_FOUND');
        // });

        const user = await models.User.findOne({
            where: { email }
        });
        return user;
    }

    async findByCountry(email) {
        const rta = await models.User.findOne({
            where: { country }
        });
        return rta;
    }

    async update(id, changes) {
        const user = await this.findOne(id);
        if (user) {
            const rta = await user.update(changes);
            delete rta.dataValues.password;
            return rta;
        } else {
            return false;
        }
    }

    async delete(id) {
        const user = await this.findOne(id);
        await user.destroy();
        return { id };
    }

    async changePassword(token, newPassword) {
        const payload = jwt.verify(token, config.jwtSecret);
        const user = await this.findOne(payload.sub);
        const recoveryToken = user._previousDataValues.recoveryToken;

        if (recoveryToken !== token) {
            throw boom.unauthorized('TOKEN_EXPIRED');
        }

        const hash = await bcrypt.hash(newPassword, 10);
        await this.update(user.id, { recoveryToken: null, password: hash });
    }

}

module.exports = UserService;