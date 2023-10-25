/**
 * File: src/middleware/authenticateToken.js
 * Data: 26/08/2023
 */

var jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateUserToken = (req, res, next)=>{
    // Get the user from JWT token and add id to req object
    const token = req.header('authToken');
    if (!token){
        return res.status(401).json({errors: ["Unauthorized Action!"]});
    }

    try{
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {email : data.userEmail};
        next();
    }
    catch(error){
        console.log(JSON.stringify(error));
        return res.status(401).send({errors: ["Unauthorized Action!"]});
    }
}

module.exports = authenticateUserToken;