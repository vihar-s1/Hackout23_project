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

const getTransactionById = async (req, res) => {                    
    // get a specific transaction by ID
    const dbTransaction = await seq.transaction();
    try{
        const {txId} = req.query;
        const tx = await Transaction.findByPk(txId);

        if (tx.senderEmail == req.user.email)
            return res.status(200).json({success: true, transaction: tx});

        const isRecipient = await TransactionRecipient.findOne({
            where: {
                transactionId: txId,
                userEmail: req.user.email
            }
        })
        if (isRecipient)
            return res.status(200).json({success: true, transaction: tx});

        return res.status(403).json({ success: false, errors: ["Access Denied"] })
    }
    catch (error){
        console.log(error.name)
        console.log(error.message)
        console.log("________________________________")
        await dbTransaction.rollback();
        return res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
}

const deleteTransaction = async (req, res) => {
    // delete a transaction by ID
    const dbTransaction = await sequelize.transaction();
  
    try {
      const { txId } = req.query;
  
      // Fetch the transaction by ID
      const transaction = await Transaction.findByPk(txId, { transaction: dbTransaction });
  
      if (!transaction) {
        await dbTransaction.rollback();
        return res.status(404).json({ success: false, errors: ['Transaction not found'] });
      }
  
      // Check if the requester has access to delete this transaction
      const userEmail = req.user.email;
      if (transaction.senderEmail !== userEmail) {
        await dbTransaction.rollback();
        return res.status(403).json({ success: false, errors: ['Access denied'] });
      }
  
      // Perform the deletion operation
      await transaction.destroy({ transaction: dbTransaction });
  
      // Commit the transaction
      await dbTransaction.commit();
  
      return res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
    } catch (error) {
      console.log(error.name);
      console.log(error.message);
      console.log('________________________________');
  
      // Rollback the transaction on error
      await dbTransaction.rollback();
  
      return res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
  };
  

module.exports = {createTransaction, getTransactionById, deleteTransaction}