const { seq } = require("../config/database");
const { DataTypes } = require("sequelize");
const User = require("./User");

const Groups = seq.define("groups", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Groups;
