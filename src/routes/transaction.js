/**
 * File: /src/routes/transaction
 * Date: 28/08/2023
 */
const express = require("express");

const authenticateUserToken = require("../middleware/authenticateUserToken");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

//. TRANSACTION MODEL ENDPOINTS

// PATH 1: (POST) /api/transaction/addtx
router.post("/addtx", authenticateUserToken, transactionController.createTransaction);

//. TRANSACTION-RECIPIENT MODEL ENDPOINTS

module.exports = router;