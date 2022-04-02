const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('./../libs/sequelize');

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
        });
        return rta;
    }

    async findOne(id) {
        return await models.User.findByPk(id).then((user) => {
            delete user.dataValues.password;
            return user;
        }).catch(() => {
            throw boom.notFound(translate('Usuario no encontrado.', 'en'));
        });
    }

    async findByEmail(email) {
        const rta = await models.User.findOne({
            where: { email }
        });
        return rta;
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
            changes.password = await bcrypt.hash(changes.password, 10);
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

}

module.exports = UserService;