/**
 * File: /src/controllers/groupController
 * Date: 25/10/2023
 */

const { seq } = require("../config/database");
const User = require("../models/User");
const Group = require("../models/Group");
const UserGroup = require("../models/UserGroup");


const createGroup = async (req, res) => {
    try {
        const { name, members } = req.body;
        const creatorMail = req.user.email;

        // Start a transaction to ensure data consistency
        const transaction = await seq.transaction();

        // Create the group
        const group = await Group.create({ name }, { transaction });

        // Add members to the group
        const emails = [creatorMail, ...members];
        if (emails && emails.length > 0) {

            await Promise.all(emails.map(async email => {
                await UserGroup.create({
                    userEmail: email,
                    groupId: group.id,
                }, { transaction }).catch(error => {
                    console.log(error.name)
                    console.log(error.message)
                    console.log("________________________________")
                    transaction.rollback();
                    return res.status(400).json({success: false, errors: ["No User with Email Found", email]})
                });
            }));
        }
        // Commit the transaction
        await transaction.commit();

        return res.status(201).json({ success: true, data: group, message: 'Group created successfully' });
    }
    catch (error) {
        console.log(error.name)
        console.log(error.message)
        console.log("________________________________")
        await transaction.rollback();
        return res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
}

const fetchGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;

        // start a transaction to ensure data consistency
        const transaction = await seq.transaction();

        // fetching users belonging to the group
        const isValidRequest = await UserGroup.findOne({where: {userEmail: req.user.email, groupId}, transaction});

        if (!isValidRequest) {
            await transaction.rollback();
            return res.status(403).json({success: false, errors: ["Unauthorized Action!"]})
        }

        const group = await Group.findByPk(groupId, {
            include: [{
                model: User,
                as: "members",
                attributes: {exclude: ["password", "createdAt", "updatedAt"]}
            }],
            attributes: {exclude: ["createdAt", "updatedAt"]},
            transaction: transaction
        });

        if (!group) {
            await transaction.rollback();
            return res.status(404).json({ success: false, errors: ['Group not found'] });
        }
        
        // commit transaction
        await transaction.commit();
        res.status(200).json({ success: true, data: group});
    } catch (error) {
        console.log(error.name)
        console.log(error.message)
        console.log("________________________________")
        await transaction.rollback();
        return res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
}

const updateGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const { name } = req.body;
        
        // start a transaction to ensure data consistency
        const transaction = await seq.transaction();

        const group = await Group.findByPk(groupId, {transaction});
        if (!group){
            await transaction.rollback();
            return res.status(404).json({ success: false, errors: ['Group not found'] });
        }
        
        const isValidMember = await UserGroup.findOne({
            where: {
                userEmail: req.user.email,
                groupId: groupId,
            },
            transaction: transaction
        });
        
        if (!isValidMember){
            await transaction.rollback();
            return res.status(401).json({ success: false, errors: ['Unauthorized Access!'] });
        }

        await group.update({ name }, {transaction});

        await transaction.commit();
        return res.status(200).json({ success: true, message: 'Group details updated' });
    } catch (error) {
        console.log(error.name)
        console.log(error.message)
        console.log("________________________________")
        await transaction.rollback();
        return res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
}

const deleteGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;

        // start a transaction to ensure data consistency
        const transaction = await seq.transaction();

        const group = await Group.findByPk(groupId, {transaction});

        if (!group){
            await transaction.rollback();
            return res.status(404).json({ success: false, errors: ['Group not found'] });
        }

        const isValidMember = await UserGroup.findOne({where: {userEmail: req.user.email, groupId}, transaction: transaction});
        if (!isValidMember){
            await transaction.rollback();
            return res.status(403).json({ success: false, errors: ["Unauthorized Action!"] });
        }

        await group.destroy({transaction});
        
        // commit the transaction
        await transaction.commit();
        return res.json({ success: true, message: 'Group deleted' });
    }
    catch (error) {
        console.log(error.name)
        console.log(error.message)
        console.log("________________________________")
        await transaction.rollback();
        return res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
}


module.exports = {createGroup, fetchGroup, updateGroup, deleteGroup};