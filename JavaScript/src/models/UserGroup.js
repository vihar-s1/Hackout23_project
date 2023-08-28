/**
 * File: src/models/UserGroup.js
 * Data: 26/08/2023
 */

const { seq } = require("../config/database");
const { DataTypes } = require("sequelize");

const User = require("./User");
const Group = require("./Group");

const UserGroup = seq.define("userGroup", {
    userEmail: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
            model: User,
            key: 'email',
        },
    },
    groupId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Group,
            key: 'id',
        },
    },
    net_balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

UserGroup.belongsTo(User, { foreignKey: 'userEmail', targetKey: 'email' });
UserGroup.belongsTo(Group, { foreignKey: 'groupId', targetKey: 'id' });

module.exports = UserGroup;
