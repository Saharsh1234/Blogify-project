const express = require("express");
const {
  createComment,
  deleteComment,
  updateComment,
} = require('../../controller/comments/commentsCtrl');

const isLogin = require('../../middlewares/isLogin')
const commentRoutes = express.Router();

//create
commentRoutes.post("/:postId", isLogin, createComment);

//update
commentRoutes.put("/:id", isLogin, updateComment);

//delete
commentRoutes.delete("/:id", isLogin, deleteComment);

module.exports = commentRoutes;