const { seq } = require("../config/database");
const { DataTypes } = require("sequelize");
const User = require("./User");

const Group = seq.define("group", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Group.sync({alter: true}).then(() => {
    console.log("Group Model synced");
});

module.exports = Group;
