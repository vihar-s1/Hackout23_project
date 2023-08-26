var jwt = require("jsonwebtoken");
require("dotenv").config();

const fetchuser = (req, res, next)=>{
    // Get the user from JWT token and add id to req object
    const token = req.header('authToken');

    if (!token){
        return res.status(401).josn({errors: ["Unauthorized Action!"]});
    }

    try{
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userMail = data.userMail;
        next();
    }
    catch(error){
        return res.status(401).send({errors: ["Unauthorized Action!"]});
    }
}

module.exports = fetchuser;