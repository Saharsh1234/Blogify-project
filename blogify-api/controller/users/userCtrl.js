const bcrypt = require('bcryptjs')
const User = require('../../models/User/User');
const { Error } = require('mongoose');
const generateToken = require('../../utils/generateToken');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../../utils/sendEmail');
const crypto = require('crypto');
const accountverificationEmail = require('../../utils/accountverificationEmail');



//register a new user
//POST end point= /api/v1/user/register
exports.register = asyncHandler(async (req, res) => {

    //get details of the user
    const { username, password, email } = req.body;

    //check if user allready exists
    const user = await User.findOne({ username });
    if (user) {
        throw new Error('user allready exists')
    }

    //register new user
    const newUser = new User({
        username,
        email,
        password
    });
    //hashing the password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    //save the user
    await newUser.save()
    res.status(201).json({
        status: 'success',
        message: 'user registered successfully',
        _id: newUser?._id,
        username: newUser?.username,
        email: newUser?.email,
        role: newUser?.role
    })
});

//loging in the user
//POST end point= /api/v1/user/login
exports.login = asyncHandler(async (req, res) => {

    //get details
    const { username, password } = req.body;

    //check if user exists
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('invalid credentials');
    }

    //compare password
    const isMatched = await bcrypt.compare(password, user?.password);
    if (!isMatched) {
        throw new Error('invalid credentials')
    }

    //update last login
    user.lastLogin = new Date();

    res.json({
        status: "success",
        username: user?.username,
        id:user?._id,
        email: user?.email,
        role: user?.role,
        token: generateToken(user),
        isVerified:user?.isVerified
    })

})

//get user profile
//GET end point= /api/v1/user/profile/
exports.getProfile = asyncHandler(async (req, res, next) => {
    console.log(req.uAuth);

    const id = req.uAuth._id;
    const user = await User.findById(id);
    res.json({
        status: "success",
        message: "profile fetched",
        user
    })
})

//get public profile
//GET end point= /api/v1/user/profile/:id
exports.getPublicProfile = asyncHandler(async (req, res, next) => {

    const id = req.params.id;
    const user = await User.findById(id).select("-password").populate({
        path:'posts',
        populate:{
            path:'category'
        }
    });
    res.json({
        status: "success",
        message: "profile fetched",
        user
    })

})

//blocking other user
//PUT end point=/api/v1/user/block/:userIdToBlock
exports.blockUser = asyncHandler(async (req, res) => {
    //find the user to be blocked
    const userIdToBlock = req.params.id
    const userToBlock = await User.findById(userIdToBlock);

    //if user to block does not exist
    if (!userToBlock) {
        throw new Error('user not found')
    }

    //find the user who is blocking
    const userIdBlocking = req.uAuth?._id;
    const currentUser =await User.findById(userIdBlocking);

    // if user it blocking itself
    if (userIdBlocking.toString() === userIdToBlock.toString()) {
        throw new Error('cannot block yourself')
    }

    //if user to block is allready blocked
    if (currentUser?.blockedUsers?.includes(userIdToBlock)) {
        throw new Error('user has been allready blocked')
    }

    //push the blocked user in the array of current user
    await User.findByIdAndUpdate(userIdBlocking, {
        $push: { blockedUsers: userIdToBlock }
    })

    //response
    res.json({
        status: 'success',
        message: 'user blocked successfully'
    })
})

//unblocking user
//PUT end point=/api/v1/unblock/:id
exports.unblockUser = asyncHandler(async (req, res) => {
    //find the user to be unblocked
    const userIdToUnblock = req.params.id
    const userToUnblock = await User.findById(userIdToUnblock);

    //if user to unblock does not exist
    if (!userToUnblock) {
        throw new Error('user not found')
    }

    //find the user who is unblocking
    const userIdUnblocking = req.uAuth?._id;
    const currentUser =await User.findById(userIdUnblocking);


    //if user is allready unblocked
    if (!currentUser.blockedUsers.includes(userIdToUnblock)) {
        throw new Error('user has not been blocked')
    }

    //remove the user from blocked
    currentUser.blockedUsers = currentUser.blockedUsers.filter((id) => id.toString() !== userIdToUnblock.toString());

    //save the current user
    await currentUser.save();

    //response
    res.json({
        status: 'success',
        message: 'user unblocked successfully'
    })
})

//forgeting password and sending email
//POST end point=/api/v1/user/forgetPassword
exports.forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    //find email in our database
    const userFound = await User.findOne({ email })
    if (!userFound) {
        throw new Error('user not found');
    }

    //generate token for user found
    const resetToken = await userFound.generatePasswordResetToken();

    //resave the user
    await userFound.save();

    //send email
    sendEmail(email, resetToken);

    res.status(200).json({
        message: 'password reset email sent',
        resetToken
    })
})

//reset password
//POST end point=/api/v1/user/resetPassword/:resetToken
exports.resetPassword = asyncHandler(async (req, res) => {
    //get the id/token from email/params
    const { resetToken } = req.params
    const { password } = req.body

    //convert the token to actual token that has been saved to dp
    const cryptoToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log(cryptoToken);

    //find the user
    const userFound = await User.findOne({
        passwordResetToken: cryptoToken,
        passwordResetExpires: { $gt: Date.now() }
    })
    if (!userFound) {
        throw new Error('password reset token expired')
    }

    //update user password
    const salt = await bcrypt.genSalt(10);
    userFound.password = await bcrypt.hash(password, salt);
    userFound.passwordResetToken=undefined
    userFound.passwordResetExpires=undefined

    //save the current user
    await userFound.save();


    res.json({
        message: 'password reset successful', 
    })
})

//sending account verification email
//POST end point=/api/v1/user/account-verification-email
exports.accountVerificationEmail=asyncHandler(async (req,res)=>{

    //find user in database
    const userFound = await User.findOne(req.uAuth?._id)
    if (!userFound) {
        throw new Error('user not found');
    }

    //generate token for user found
    const verificationToken = await userFound.generateAccountVerificationToken();

    //resave the user
    await userFound.save();

    //send email
    accountverificationEmail(userFound?.email, verificationToken);

    res.status(200).json({
        message: 'account verification email sent',
        verificationToken
    })
})

//verifing account
//POST end point=/api/v1/user/verify-account/:verifyToken
exports.accountVerification=asyncHandler(async (req,res)=>{
    //get the id/token from email/params
    const { verifyToken } = req.params

    //convert the token to actual token that has been saved to dp
    const cryptoToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
    console.log(cryptoToken);

    //find the user
    const userFound = await User.findOne({
        accountVerificationToken: cryptoToken,
        accountVerificationExpires: { $gt: Date.now() }
    })
    if (!userFound) {
        throw new Error('password reset token expired')
    }

    //update user password
    userFound.isVerified=true;
    userFound.accountVerificationToken=undefined
    userFound.accountVerificationExpires=undefined

    //save the current user
    await userFound.save();


    res.json({
        message: 'user verified successfully',
        userFound 
    })
})

//view account
//GET end point=/api/v1/user/view-account/:id
exports.viewUser = asyncHandler(async (req, res) => {
    //find the user to be viewed
    const userIdToView = req.params.id
    const userToView = await User.findById(userIdToView);

    //if user to view does not exist
    if (!userToView) {
        throw new Error('user not found')
    }

    //find the user who is viewing
    const userIdViewing = req.uAuth?._id;
    const currentUser =await User.findById(userIdViewing);


    //if user to view is allready viewed
    if (userToView?.profileViewers?.includes(userIdViewing)) {
        throw new Error('profile has allresdy been viewed')
    }

    //push the current user into user to view 
    await User.findByIdAndUpdate(userIdToView, {
        $push: { profileViewers:userIdViewing  }
    })

    //response
    res.json({
        status: 'success',
        message: 'user viewed successfully'
    })
})

//follow account
//PUT end point=/api/v1/user/follow-account/:id
exports.followUser=asyncHandler(async(req,res)=>{
    //find the user who wants to follow
    userfollowingID=req.uAuth?._id
    
    //find the user who we have to follow
    userIDtofollow=req.params.id

    //if the user wants to follow himself
    if(userfollowingID.toString()===userIDtofollow.toString()){
        throw new Error('you cannot follow yourself')
    }

    //push the userIDtofollow into following field of userfollowingID
    await User.findByIdAndUpdate(userfollowingID,{
        $addToSet:{following:userIDtofollow}
    },
    {
        new:true
    })

    //push the userfollowingID into followers field of userIDtofollow
    await User.findByIdAndUpdate(userIDtofollow,{
        $addToSet:{followers:userfollowingID}
    },
    {
        new:true
    })

    //response
    res.json({
        status:'success',
        message:'you have successfully followed the account'
    })
})

//unfollow account
//PUT end point=/api/v1/user/unfollow-account/:id
exports.unfollowUser=asyncHandler(async(req,res)=>{
    //find the user who wants to unfollow
    userunfollowingID=req.uAuth?._id
    
    //find the user who we have to unfollow
    userIDtounfollow=req.params.id

    //if the user wants to unfollow himself
    if(userunfollowingID.toString()===userIDtounfollow.toString()){
        throw new Error('you cannot unfollow yourself')
    }

    //push the userIDtofollow into following field of userfollowingID
    await User.findByIdAndUpdate(userunfollowingID,{
        $pull:{following:userIDtounfollow}
    },
    {
        new:true
    })

    //push the userfollowingID into followers field of userIDtofollow
    await User.findByIdAndUpdate(userIDtounfollow,{
        $pull:{followers:userunfollowingID}
    },
    {
        new:true
    })

    //response
    res.json({
        status:'success',
        message:'you have successfully unfollowed the account'
    })
})

//update profile
//PUT end point=/api/v1/user/update-profile
exports.updateUserProfile = asyncHandler(async (req, res) => {
    //Check if the user exists
    const userId = req.uAuth?._id;
    const userFound = await User.findById(userId);
    if (!userFound) {
      throw new Error("User not found");
    }
    console.log(userFound);
    const { username, email } = req.body;
    const post = await User.findByIdAndUpdate(
      userId,
      {
        email: email ? email : userFound?.email,
        username: username ? username : userFound?.username,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).json({
      status: "success",
      message: "User successfully updated",
      post,
    });
  });