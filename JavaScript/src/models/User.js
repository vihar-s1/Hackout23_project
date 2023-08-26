const { seq } = require("../config/database");
const { DataTypes } = require("sequelize");

const User = seq.define("user", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    netBalance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
});

User.sync({alter: true}).then(() => {
    console.log("User Model synced");
});

module.exports = User;
