const { seq } = require("../config/database");
const { DataTypes } = require("sequelize");
const User = require("./User"); // Assuming you have a User model

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

Transaction.belongsTo(User, { as: 'sender', foreignKey: 'senderUserId' });
Transaction.belongsTo(User, { as: 'recipient', foreignKey: 'recipientUserId' });

Transaction.sync({alter: true}).then(() => {
    console.log("Transaction Model synced");
});


module.exports = Transaction;
