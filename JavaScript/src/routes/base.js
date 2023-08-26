/**
 * File: src/routes/index.js
 * Data: 26/08/2023
 */

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send({
        success: true,
        message: "Reached the Splitwise Backend",
    });
});

router.get(
    "/hello",
    (req, res) => {
        res.status(200).send({
            success: true,
            message: "hello to you too" 
        })
    }
);

module.exports = router;
