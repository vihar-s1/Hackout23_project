/**
 * File: /src/routes/group
 * Date: 28/08/2023
 */
const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const { seq } = require("../config/database");
const User = require("../models/User");
const Group = require("../models/Group");
const UserGroup = require("../models/UserGroup");

const router = express.Router();

// PATH 1: (POST) /api/group/create-group
router.post(
    '/create-group',
    authenticateToken,
    async (req, res) => {
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
            return res.status(500).json({ success: false, errors: ['Internal Server Error'] });
        }
    }
);


// PATH 2: (GET) /api/group/:groupId
router.get(
    '/:groupId',
    authenticateToken,
    async (req, res) => {
        try {
            const groupId = req.params.groupId;

            // fetching users belonging to the group
            const isValidRequest = await UserGroup.findOne({where: {userEmail: req.user.email, groupId}});

            if (!isValidRequest) return res.status(401).json({success: false, errors: ["Unauthorized Action!"]})

            const group = await Group.findByPk(groupId, {
                include: [{
                    model: User,
                    as: "members",
                    attributes: {exclude: ["password", "createdAt", "updatedAt"]}
                }],
                attributes: {exclude: ["createdAt", "updatedAt"]}
            });
    
            if (!group) {
                return res.status(404).json({ success: false, errors: ['Group not found'] });
            }
    
            res.json({ success: true, data: group});
        } catch (error) {
            console.log(error.name)
            console.log(error.message)
            console.log("________________________________")
            return res.status(500).json({ success: false, errors: ['Internal Server Error'] });
        }
    }
);


// PATH 3: (PUT) /api/group/update/:groupId
router.put(
    '/update/:groupId',
    authenticateToken,
    async (req, res) => {
        try {
            const groupId = req.params.groupId;
            const { name } = req.body;
            
            const group = await Group.findByPk(groupId);
            if (!group)
                return res.status(404).json({ success: false, errors: ['Group not found'] });
            
            const isValidMember = await UserGroup.findOne({
                where: {
                    userEmail: req.user.email,
                    groupId: groupId,
                }
            });
            
            if (!isValidMember)
                return res.status(401).json({ success: false, errors: ['Unauthorized Access!'] });

            await group.update({ name });

            return res.status(200).json({ success: true, message: 'Group details updated' });
        } catch (error) {
            console.log(error.name)
            console.log(error.message)
            console.log("________________________________")
            return res.status(500).json({ success: false, errors: ['Internal Server Error'] });
        }
    }
);


// PATH 4: (DELETE) /api/group/delete/:groupId
router.delete(
    '/delete/:groupId',
    authenticateToken,
    async (req, res) => {
        try {
            const groupId = req.params.groupId;
            const group = await Group.findByPk(groupId);

            if (!group)
                return res.status(404).json({ success: false, errors: ['Group not found'] });

            const isValidMember = await UserGroup.findOne({where: {userEmail: req.user.email, groupId}});
            if (!isValidMember)
                return res.status(401).json({ success: false, errors: ["Unauthorized Action!"] });

            await group.destroy();

            return res.json({ success: true, message: 'Group deleted' });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, errors: ['Internal Server Error'] });
        }
    }
);


module.exports = router;