/**
 * File: src/models/TransactionRecipient.js
 * Data: 26/08/2023
 */

const { seq } = require("../config/database");
const { DataTypes } = require("sequelize");

const User = require("./User");
const Transaction = require("./Transaction");

const TransactionRecipient = seq.define("transactionRecipient", {
    received_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

Transaction.belongsToMany(User, { through: TransactionRecipient, as: 'recipients' });

module.exports = TransactionRecipient;
