const { seq } = require("../config/database");
const { DataTypes } = require("sequelize");
const Transaction = require("./Transaction"); // Assuming you have a Transaction model
const Group = require("./Group"); // Assuming you have a Group model

const GroupTransaction = seq.define("groupTransaction", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
});

Group.belongsToMany(Transaction, { through: GroupTransaction });
Transaction.belongsToMany(Group, { through: GroupTransaction });

GroupTransaction.sync({alter: true}).then(() => {
    console.log("GroupTransaction Model synced");
});


module.exports = GroupTransaction;
