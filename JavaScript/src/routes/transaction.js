/**
 * File: src/routes/transaction.js
 * Data: 27/08/2023
 */

const express = require("express");
const Transactions = require("../models/Transactions");

const router = express.Router();
require("dotenv").config();

// PATH 0: TEST PATH
router.get("/", async (req, res) => {
    return res.status(200).json({ body: req.body, query: req.query });
});

// PATH 1: (POST) Create One-on-One Transaction /api/transaction/newtx
router.post(
    "/createtx",
    async (req, res) => {
        try {
            const {groupId, sender, reciever, amount} = req.body;
            const txData = {
                sender_email: sender,
                recipient_email: reciever,
                amount: amount
            };
            if (groupId) { txData["groupId"] = groupId; }
            
            await Transactions.create(txData);

            return res.status(201).json({success: true});
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ errors: ["Internal Server Error!"] });
        }
    }
)


// PATH 2: (POST) /api/transaction/


module.exports = router;