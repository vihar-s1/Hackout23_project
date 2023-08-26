const { seq } = require("../config/database");
const { DataTypes } = require("sequelize");

const User = require("./User");
const Group = require("./Group");

const UserGroup = seq.define("userGroup", {});

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

module.exports = UserGroup;
