/**
 * File: /src/controllers/userController
 * Date: 25/10/2023
 */

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { seq } = require("../config/database");

require("dotenv").config();


const createNewUser =  async (req, res) => {
    try{
        const { fullName, email, password } = req.body;
        
        // Start a transaction to ensure data consistency
        const transaction = await seq.transaction();
        
        const user = await User.findOne({where: {email: email}, transaction});
        
        if (user){
            await transaction.rollback();
            return res.status(400).json({success: false, errors: ["Email Already Under Use!"]});
        }
        
        // Hashnig the Password
        const salt = await bcryptjs.genSalt(10);
        const securePassword = await bcryptjs.hash(password, salt);
        
        // Creating new User
        const newUser = await User.create({
            full_name: fullName,
            email: email,
            password: securePassword,
        }, {transaction});

        // commit the transaction
        await transaction.commit();
        // JWT token
        const token = jwt.sign({ userEmail: email }, process.env.JWT_SECRET, {expiresIn: process.env.TOKEN_LIFE });

        return res.status(201).json({success: true, authToken: token, userEmail: email});
    }
    catch (error){
        console.log(error.name)
        console.log(error.message)
        console.log("________________________________")
        await transaction.rollback();
        return res.status(500).json({success: false, errors: ["Internal Server Error!"]});
    }
}


const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // start a transaction to ensure data consistency
        const transaction = await seq.transaction();

        const user = await User.findOne({ where: { email }, transaction });

        if (!user) {
            // invalid email
            await transaction.rollback();
            return res.status(401).json({ success: false, errors: ['User not found'] });
        }

        // verifying password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid){
            await transaction.rollback();
            return res.status(401).json({ success: false, errors: ['Invalid credentials'] });
        }

        // commit the transaction
        await transaction.commit();
        // JWT token
        const token = jwt.sign({ userEmail: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_LIFE });
        res.status(200).json({ success: true, authToken: token, email: email });
    }
    catch (error) {
        console.log(error.name)
        console.log(error.message)
        console.log("________________________________")
        await transaction.rollback();
        res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
}


const fetchUserProfile = async (req, res) => {
    try {
        // create a transaction to ensure data consistency
        const transaction = await seq.transaction();
        const user = await User.findOne({ where: { email: req.user.email }, attributes: {exclude: "password"}, transaction });

        if (user) {
            // User with that email exists
            await transaction.commit();
            res.status(200).json({ success: true, user: user });
        }
        else{
            // user with that email does not exists
            await transaction.rollback();
            res.status(404).json({ success: false, errors: ["User Not Found"]  });
        }
    } 
    catch (error) {
        console.log(error.name);
        console.log(error.message);
        console.log("________________________________");
        await transaction.rollback();
        res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
}


const updateUserProfile = async (req, res) => {
    try {
        const { full_name } = req.body;
        
        // start a transaction to ensure data consistency
        const transaction = await seq.transaction();

        // updating the profile
        /**
         * Nothing happens when invalid email is given since incorrect email will
         * not return any rows to update.
         */
        await User.update({ full_name }, { where: { email: req.user.email }, transaction });

        // commit the transaction
        await transaction.commit();
        res.status(200).json({ success: true, message: 'Profile updated' });
    }
    catch (error) {
        console.log(error.name)
        console.log(error.message)
        console.log("________________________________")
        await transaction.rollback();
        res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
}


const changePassword = async (req, res) => {
    try {
        const { current_password, new_password } = req.body;

        // start a transaction to ensure data consistency
        const transaction = await seq.transaction();
        const user = await User.findOne({ where: { email: req.user.email }, transaction });
        
        // validate current password
        const isPasswordValid = await bcryptjs.compare(current_password, user.password);
        if (!isPasswordValid){
            await transaction.rollback();
            return res.status(403).json({ success: false, errors: ['Invalid current password'] });
        }

        // hash new password
        const salt = await bcryptjs.genSalt(10);
        const hashedNewPassword = await bcryptjs.hash(new_password, salt);

        // update the database
        await User.update({ password: hashedNewPassword }, { where: { email: req.user.email }, transaction });

        // commit the transaction
        await transaction.commit();
        res.status(200).json({ success: true, message: 'Password updated' });
    }
    catch (error) {
        console.log(error.name)
        console.log(error.message)
        console.log("________________________________")
        await transaction.rollback();
        res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
}


const deleteUser = async (req, res) => {
    try {
        const email = req.user.email;
        
        // start a transaction to ensure data consistency
        const transaction = await seq.transaction();

        const user = await User.findByPk(email, {transaction});

        if (!user){
            await transaction.rollback();
            return res.status(404).json({success: false, errors: ["User Not Found", email]});
        }
        
        await user.destroy({ transaction });
        // commit transaction
        await transaction.commit();
        return res.status(200).json({success: true, message: ["User Deleted"]})
    }
    catch (error){
        console.log(error.name)
        console.log(error.message)
        console.log("________________________________")
        await transaction.rollback();
        res.status(500).json({ success: false, errors: ['Internal Server Error'] });
    }
}

module.exports = {createNewUser, userLogin, fetchUserProfile, updateUserProfile, changePassword, deleteUser};