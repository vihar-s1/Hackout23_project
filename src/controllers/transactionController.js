/**
 * File: /src/controllers/transactionController
 * Date: 25/10/2023
 */

const { seq } = require("../config/database");
const User = require("../models/User");
const UserGroup = require("../models/UserGroup");
const Transaction = require("../models/Transaction");
const TransactionRecipient = require("../models/TransactionRecipient");


const createTransaction = async (req, res) => {
    // create a data-base transaction to ensure data consistency in the relational database
    const dbTransaction = await seq.transaction();
    try {
        const {groupId, amount, recipientEmails} = req.body;

        if (groupId){
            const userGroup = await UserGroup.findOne({
                where: {
                    groupId,
                    payer_email: req.user.email,
                    amount: amount
                },
                transaction: dbTransaction // refers to the database tx created when writing to database.
            });
    
            if (!userGroup) {
                await dbTransaction.rollback(); // rollback tx on error
                return res.status(403).json({success: false, errors: ["User is not a member of this group."]});
            }
        }
        // Adding the tx entry
        var txData = {amount: amount, senderEmail: req.user.email};
        if (groupId)
            txData.groupId = groupId;
        
        const createdTx = await Transaction.create(txData, {dbTransaction});

        // Handling recipients and updating net balance
        const recipientUsers = await User.findAll({where: {email: {in: recipientEmails}}});
        
        if (recipientUsers.length !== recipientEmails.length){
            dbTransaction.rollback();
            return res.status(403).json({success: false, errors: ["Emails with no corresponding user recieved"]});
        }

        // some of the emails provided may not actually belong to any user so we instead focus on recipientUsers
        let receivedAmount = amount / recipientUsers.length;

        await Promise.all(recipientUsers.map(user => {
            TransactionRecipient.create({
                transactionId: createdTx.id,
                userEmail: user.email,
                received_amount: receivedAmount,
            }, {transaction: dbTransaction});
        }));

        await dbTransaction.commit();
        return res.status(201).json({success: true, createTransaction});
    }   
    catch (error){
        console.log(error.name)
        console.log(error.message)
        console.log("________________________________")
        await dbTransaction.rollback();
        return res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
}

module.exports = {createTransaction}