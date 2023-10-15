const User = require("../models/User/User")

const isVerify=async (req,res,next)=>{
    try {
        //find the user in database
        const user= await User.findById(req.uAuth?._id)
        
        //check if user is verified
        if(user?.isVerified){
            next();
        }
        else{
            res.status(401).json({
                message:'user not verified'
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"server error",
            error
        })
    }
}

module.exports=isVerify