/**
 * File: app.js
 * Date: 26/08/2023
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use('/public', express.static("public"))

// using express.json() middleware to parse request having header application/json.
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// enabling cors as middleware to allow requests from frontend only
app.use(cors({
    origin: process.env.FRONTEND_URL.replace(/"/g, ""),
    credentials: true
}));


app.use("/api/user", require("./routes/user"));
app.use("/api/group", require("./routes/group"));
app.use("/api/transaction", require("./routes/transaction"));


module.exports = app;