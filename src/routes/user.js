/**
 * File: /src/routes/user
 * Date: 28/08/2023
 */

const express = require("express");
const authenticateUserToken = require("../middleware/authenticateUserToken");

const userController = require("../controllers/userController");

const router = express.Router();
require("dotenv").config();


// PATH 1: (POST) /api/user/newuser
router.post("/new-user", userController.createNewUser);

// PATH 2: (POST) /api/user/login
router.post("/login", userController.userLogin);

// PATH 3: (GET) /api/user/profile
router.get("/profile", authenticateUserToken, userController.fetchUserProfile);

// PATH 4: (PUT) /api/user/update-profile
router.put("/update-profile", authenticateUserToken, userController.updateUserProfile);

// PATH 5: (PUT) /api/user/change-password
router.put("/change-password", authenticateUserToken, userController.changePassword);

// PATH 6: (DELETE) /api/user/delete
router.delete("/delete", authenticateUserToken, userController.deleteUser);
 

module.exports = router;