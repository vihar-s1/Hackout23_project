/**
 * File: src/models/UserGroup.js
 * Data: 26/08/2023
 */

const { seq } = require("../config/database");
const { DataTypes } = require("sequelize");

const User = require("./User");
const Group = require("./Group");

const UserGroup = seq.define("userGroup", {
    net_balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

Group.belongsToMany(User, { through: UserGroup, as: "members", onDelete: "CASCADE",});
User.belongsToMany(Group, { through: UserGroup, as: "members", onDelete: "CASCADE",});

module.exports = UserGroup;
