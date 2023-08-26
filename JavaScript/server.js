/**
 * File: server.js
 * Data: 26/08/2023
 */

const app = require('./src/app');
const { connectToDB } = require('./src/config/database');

const port = process.env.PORT || 8000;

app.listen(port, () => {
  connectToDB();
  console.log(`Application running on http://localhost:${port}`);
});