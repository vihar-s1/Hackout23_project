/**
 * File: /src/routes/user
 * Date: 28/08/2023
 */

const express = require("express");
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();
require("dotenv").config();


// PATH 1: (POST) /api/user/newuser
router.post(    
    "/new-user",
    async (req, res) => {
        try{
            const { fullName, email, password } = req.body;
            const user = await User.findOne({where: {email: email}});
            
            if (user)
                return res.status(400).json({success: false, errors: ["Email Already Under Use!"]});
            
            // Hashnig the Password
            const salt = await bcryptjs.genSalt(10);
            const securePassword = await bcryptjs.hash(password, salt);
            
            // Creating new User
            const newUser = await User.create({
                full_name: fullName,
                email: email,
                password: securePassword,
            });

            // JWT token
            const token = jwt.sign({ userEmail: email }, process.env.JWT_SECRET, {expiresIn: process.env.TOKEN_LIFE });

            return res.status(201).json({success: true, authToken: token, userEmail: email});
        }
        catch (error){
            console.log(error);
            return res.status(500).json({success: false, errors: ["Internal Server Error!"]});
        }
    }
);


// PATH 2: (POST) /api/user/login
router.post(
    '/login',
    async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) // invalid email
                return res.status(401).json({ success: false, errors: ['User not found'] });

            // verifying password
            const isPasswordValid = await bcryptjs.compare(password, user.password);
            if (!isPasswordValid)
                return res.status(401).json({ success: false, errors: ['Invalid credentials'] });

            // JWT token
            const token = jwt.sign({ userEmail: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_LIFE });
            res.status(200).json({ success: true, authToken: token, email: email });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ success: false, errors: ['Internal Server Error'] });
        }
    }
);


// PATH 3: (GET) /api/user/profile
router.get(
    '/profile',
    authenticateToken,
    async (req, res) => {
        try {
            console.log(req.user)
            console.log(req.user.email)
            const user = await User.findOne({ where: { email: req.user.email }, attributes: {exclude: "password"} });

            if (user) // User with that email exists
                res.status(200).json({ success: true, user: user });
            else // user with that email does not exists
                res.status(401).json({ success: false, errors: ["User with that Email does not exist!"]  });
        } 
        catch (error) {
            console.log(error);
            res.status(500).json({ success: false, errors: ['Internal Server Error'] });
        }
    }
);


// PATH 4: (PUT) /api/user/update-profile
router.put(
    '/update-profile',
    authenticateToken,
    async (req, res) => {
        try {
            const { full_name } = req.body;
            
            // updating the profile
            /**
             * Nothing happens when invalid email is given since incorrect email will
             * not return any rows to update.
             */
            await User.update({ full_name }, { where: { email: req.user.email } });

            res.status(200).json({ success: true, message: 'Profile updated' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ success: false, errors: ['Internal Server Error'] });
        }
    }
);


// PATH 5: (PUT) /api/user/change-password
router.put(
    '/change-password',
    authenticateToken,
    async (req, res) => {
        try {
            const { current_password, new_password } = req.body;
            const user = await User.findOne({ where: { email: req.user.email } });
            
            // validate current password
            const isPasswordValid = await bcryptjs.compare(current_password, user.password);
            if (!isPasswordValid)
                return res.status(401).json({ success: false, errors: ['Invalid current password'] });
    
            // hash new password
            const salt = await bcryptjs.genSalt(10);
            const hashedNewPassword = await bcryptjs.hash(new_password, salt);

            // update the database
            await User.update({ password: hashedNewPassword }, { where: { email: req.user.email } });

            res.status(200).json({ success: true, message: 'Password updated' });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ success: false, errors: ['Internal Server Error'] });
        }
    }
);
 

module.exports = router;