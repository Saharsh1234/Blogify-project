const jwt = require('jsonwebtoken');
const User = require('../models/User/User');
const isLogin = (req, res, next) => {
    //get token from header
    const token = req.headers.autherization?.split(" ")[1];


    //verify the token
    jwt.verify(token, process.env.JWT_KEY, async (error, decoded) => {
        
        //finding the user in the database with the given token
        const userID=decoded?.user?.id;
        const user=await User.findById(userID).select('username email role _id');

        req.uAuth=user;
        if (error) {
            const err=new Error('token expired/invalid')
            next(err);
        }
        else {
            next();
        }
    })

}

module.exports = isLogin;