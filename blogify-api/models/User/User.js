const mongoose = require("mongoose");
const crypto=require('crypto');

//schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountLevel: {
      type: String,
      enum: ["bronze", "silver", "gold"],
      default: "bronze",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    notificationPreferences: {
      email: { type: String, default: true },
      //..other notifications (sms)
    },
    gender: {
      type: String,
       enum: ["male", "female", "prefer not to say", "non-binary"],
    },
    profileViewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    accountVerificationToken: {
      type: String,
    },
    accountVerificationExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
//generating token for password reset
userSchema.methods.generatePasswordResetToken=function () {
  //generate token
  const resetToken=crypto.randomBytes(20).toString('hex');

  //assign token to passwordResetToken field
  this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');

  //when token expires
  this.passwordResetExpires=Date.now()+10*60*1000;//token expires in 10 min

  return resetToken;
}

//generate account verification token
userSchema.methods.generateAccountVerificationToken=function () {
  //generate token
  const verificationToken=crypto.randomBytes(20).toString('hex');

  //assign token accountVerificationToken field
  this.accountVerificationToken=crypto.createHash('sha256').update(verificationToken).digest('hex');

  //when token expires
  this.accountVerificationExpires=Date.now()+10*60*1000;//token expires in 10 min

  return verificationToken;
}

//making the model of this schema
const User=mongoose.model('User',userSchema);

//exporting
module.exports=User;