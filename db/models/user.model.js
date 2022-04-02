const { Model, DataTypes, Sequelize, QueryInterface } = require('sequelize');
const USERS_TABLE = 'users';

const UserSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    country: {
        allowNull: false,
        type: DataTypes.STRING(4),
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING(100),
    },
    lastName: {
        allowNull: false,
        type: DataTypes.STRING(100),
        field: 'last_name',
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING(64),
        isEmail: true,
        unique: true
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING()
    },
    role: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: 'customer'
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW
    }

};

QueryInterface.add
class User extends Model {
    static associate() {
        // associate
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: USERS_TABLE,
            modelName: 'User',
            timestamps: true
        }
    }
}

module.exports = { USERS_TABLE, UserSchema, User };