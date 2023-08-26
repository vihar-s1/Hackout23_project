const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");
const Group = require("../models/Group");
const UserGroup = require("../models/UserGroup");

const router = express.Router();

// PATH 0: TEST PATH
router.get("/", async (req, res) => {
    return res.status(200).json({ body: req.body, query: req.query });
});

// PATH 1: (POST) Create Group /api/group/newgroup
router.post("/newgroup", fetchuser, async (req, res) => {
    try {
        const { userMail, groupName, groupMembers } = req.body;

        // create group
        const group = await Group.create({ name: groupName });

        // add members
        let nonUserMembers = [];

        // adding user who created the group
        const creator = await User.findOne({attributes:["email"], where: {email: userMail}})
        
        await UserGroup.create({
            userEmail: creator.email,
            groupId: group.id
        })
        console.log(req.body)
        // adding the rest of the members
        
        for (var i=0; i<groupMembers.length; i++){
            const user = await User.findOne({attributes:["email"], where: {email: groupMembers[i]}});
    
            if (user && user.email != creator.email){
                try{
                    await UserGroup.create({
                        userEmail: user.email,
                        groupId: group.id,
                    })
                }
                catch(error) { console.log(error); }
            }
            else{
                nonUserMembers.push(groupMembers[i]);
            }
        }

        return res
            .status(201)
            .json({ success: true, message: ["Group Created with Existing Members"], excluded: nonUserMembers, totalExcluded: nonUserMembers.length });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal Server Error!"] });
    }
});

module.exports = router;
