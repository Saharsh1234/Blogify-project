const express=require('express');
const { register, getProfile, forgetPassword, resetPassword, accountVerificationEmail, accountVerification, unblockUser, viewUser, followUser, unfollowUser, getPublicProfile, updateUserProfile} = require('../../controller/users/userCtrl');
const {login,blockUser}= require('../../controller/users/userCtrl');
const isLogin = require('../../middlewares/isLogin');




const userRoutes=express.Router();

//register new user
userRoutes.post('/register',register)

//login registered user
userRoutes.post('/login',login)

//get public user profile
userRoutes.get('/public-profile/:id',isLogin,getPublicProfile)

//get private user profile
userRoutes.get('/profile/',isLogin,getProfile)

//forget password user
userRoutes.post('/forgetPassword',forgetPassword)

//reset password
userRoutes.post('/resetPassword/:resetToken',resetPassword)

//send account verification email
userRoutes.put('/account-verification-email',isLogin,accountVerificationEmail)

//verifing account
userRoutes.get('/verify-account/:verifyToken',isLogin,accountVerification)

//block user
userRoutes.put('/block/:id',isLogin,blockUser)

//unblock user
userRoutes.put('/unblock/:id',isLogin,unblockUser)

//view user
userRoutes.get('/view-account/:id',isLogin,viewUser)

//follow user
userRoutes.put('/follow-account/:id',isLogin,followUser)

//unfollow user
userRoutes.put('/unfollow-account/:id',isLogin,unfollowUser)

//update user profile
userRoutes.put('/update-profile',isLogin,updateUserProfile)

module.exports=userRoutes;