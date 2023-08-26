const { Sequelize } = require("sequelize");
require("dotenv").config();

const DB_URL = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const sequelize = new Sequelize(DB_URL);

const connectToDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } 
	catch (error) {
        console.log("Unable to connect to the database:", error);
    }
};

module.exports = { seq: sequelize, connectToDB };
