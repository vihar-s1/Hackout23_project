/**
 * File: src/models/Transaction.js
 * Data: 26/08/2023
 */

const { seq } = require("../config/database");
const { DataTypes } = require("sequelize");

const User = require("./User");
const Group = require("./Group");

const Transaction = seq.define("transaction", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

Transaction.belongsTo(User, { as: 'sender', foreignKey: 'payer_email' });
Transaction.belongsTo(Group, { as: 'group', foreignKey: 'groupId' });

module.exports = Transaction;
