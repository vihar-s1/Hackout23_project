/**
 * File: src/models/Group.js
 * Data: 26/08/2023
 */

const { seq } = require("../config/database");
const { DataTypes } = require("sequelize");
const User = require("./User");

const Group = seq.define("group", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Group;
