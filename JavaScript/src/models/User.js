const { sq: seq } = require("../config/database");
const { DataTypes } = require("sequelize");

const User = seq.define("user", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    fullName: {
        type: DataTypes.STRING,
    }
});

User.sync().then(() => {
    console.log("User Model synced");
});

module.exports = User;
