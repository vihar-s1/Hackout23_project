/**
 * File: server.js
 * Data: 26/08/2023
 */

const app = require('./src/app');

const User = require("./src/models/User")
const Group = require("./src/models/Group")
const UserGroup = require("./src/models/UserGroup")
const Transactions = require("./src/models/Transactions");

const { connectToDB } = require('./src/config/database');

const port = process.env.PORT || 8000;

app.listen(port, async () => {
  await connectToDB();
  console.log(`Application running on http://localhost:${port}`);

  const models  = [User, Group, UserGroup, Transactions];
  
  models.forEach(async (model) => {
    await model.sync({alter: true}).then(() => {
      console.log(`${model.name} model synced`);
    })
  })
});