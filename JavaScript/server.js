/**
 * File: server.js
 * Data: 26/08/2023
 */

const app = require("./src/app");

const User = require("./src/models/User");
const Group = require("./src/models/Group");
const UserGroup = require("./src/models/UserGroup");
const Transactions = require("./src/models/Transaction");
const TransactionRecipient = require("./src/models/TransactionRecipient");

const { connectToDB, createTriggers } = require("./src/config/database");

const port = process.env.PORT || 8000;

app.listen(port, async () => {
    await connectToDB();
    console.log(`Application running on http://localhost:${port}`);

    /************* SYNCING THE MODELS WITH DATABASE *************/
    const models = [User, Group, UserGroup, Transactions, TransactionRecipient];
    for (var i=0; i<models.length; i++){
        await models[i].sync({ alter: true }).then(() => {
            console.log(`${models[i].name} model synced`);
        });
    }

    /********************* CREATING TRIGGER *********************/
    console.log("------------------------------------------------")
    createTriggers().then(() => {
        console.log("TRIGGERS CREATED SUCCESSFULLY");
    }).catch((error) => {
        console.log(error);
    })
});
