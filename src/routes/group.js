/**
 * File: /src/routes/group
 * Date: 28/08/2023
 */
const express = require("express");
const router = express.Router();


const authenticateUserToken = require("../middleware/authenticateUserToken");
const { seq } = require("../config/database");
const User = require("../models/User");
const Group = require("../models/Group");
const UserGroup = require("../models/UserGroup");

const groupController = require("../controllers/groupController");


// PATH 1: (POST) /api/group/create-group
router.post("/create-group", authenticateUserToken, groupController.createGroup);

// PATH 2: (GET) /api/group/:groupId
router.get("/:groupId", authenticateUserToken, groupController.fetchGroup);

// PATH 3: (PUT) /api/group/update/:groupId
router.put("/update/:groupId", authenticateUserToken, groupController.updateGroup);

// PATH 4: (DELETE) /api/group/delete/:groupId
router.delete("/delete/:groupId", authenticateUserToken, groupController.deleteGroup);

module.exports = router;