/**
 * File: /src/config/database.js
 * Date: 26/08/2023
 */

const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const DB_URL = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const sequelize = new Sequelize(DB_URL, {logging: false});


const connectToDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } 
	catch (error) {
        console.log("Unable to connect to the database:", error);
    }
};


async function executeSQLFilesInFolder(folderPath) {
    const files = fs.readdirSync(folderPath);
    
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        try {
            const sql = fs.readFileSync(filePath, 'utf-8');
            await sequelize.query(sql);
            console.log(`Executed file ${file} successfully`);
        } catch (error) {
            console.log(`Error executing ${file}`);
            console.log(error.name);
            console.log(error.message);
        }
    }
}


const createTriggers = async () => {
    const triggerPath = path.join(__dirname, "../../SQLfiles", "triggers");
    await executeSQLFilesInFolder(triggerPath);
}


module.exports = { seq: sequelize, connectToDB, createTriggers};
