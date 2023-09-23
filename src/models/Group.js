/**
 * File: src/models/Group.js
 * Data: 26/08/2023
 */

const { seq } = require("../config/database");
const { DataTypes } = require("sequelize");

const Group = seq.define("group", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Group;
