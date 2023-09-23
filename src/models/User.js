/**
 * File: src/models/User.js
 * Data: 26/08/2023
 */

const { seq } = require("../config/database");
const { DataTypes } = require("sequelize");

const User = seq.define("user", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    net_balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
});


module.exports = User;
