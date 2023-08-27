/**
 * File: src/routes/user.js
 * Data: 26/08/2023
 */

const express = require("express");
const router  = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

require("dotenv").config();

// PATH 0: TEST PATH
router.get(
    "/",
    async (req, res) => {
        return res.status(200).json({body: req.body, query: req.query});
    }
)

// PATH 1: (POST) new user /api/user/newuser
router.post(
    "/newuser",
    async (req, res) => {
        try{
            const {email, name, password} = req.body;
            const user = await User.findOne({where: {email: email}});
            
            if (user)
                return res.status(400).json({errors: ["User with That Email Already Exists!"]})

            const salt = await bcrypt.genSalt(10);
            const securePassword = await bcrypt.hash(password, salt);
            
            const newUser = await User.create({email: email, full_name: name, password: securePassword});
            const token = jwt.sign({userId: newUser.id}, process.env.JWT_SECRET, {expiresIn: "12h"});

            return res.status(201).json({success: true, authToken: token, email: newUser.email});
        }
        catch(error){
            console.log(error);
            return res.status(500).json({errors: ["Internal Server Error!"]});
        }
    }
)


// PATH 2: (GET) Login /api/user/login
router.post(
    "/login",
    async (req, res) => {
        try{
            const {email , password} = req.body;

            const user = await User.findOne({where: {email: email}});
            
            if (!user)
                return res.status(400).json({errors: ["User Does Not Exist!"]})
            
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare)
                return res.status(400).json({errors: ["Invalid Password"]});
            
            const token = jwt.sign({userMail: user.email}, process.env.JWT_SECRET, {expiresIn: "12h"});

            return res.status(200).json({success: true, authToken: token, email: user.email});
        }
        catch(error){
            console.log(error);
            return res.status(500).json({errors: ["Internal Server Error!"]});
        }
    }
)


module.exports = router;