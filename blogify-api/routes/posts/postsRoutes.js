const express=require('express');
const multer=require('multer');
const isLogin = require('../../middlewares/isLogin');
const { createPost,getPosts,getPost,deletePost,updatePost,likePost,dislikePost,claps,schedulePost, postViewCount} = require('../../controller/posts/postsCtrl');
const isVerify = require('../../middlewares/isVerify');
const storage = require('../../utils/fileUpload');





const postsRoutes=express.Router();

const upload=multer({storage})

//create post
postsRoutes.post('/',isLogin,createPost);

//fetch all post
postsRoutes.get('/public',getPosts);

//featch post list
postsRoutes.get('/',isLogin,getPosts);

//fetch one post
postsRoutes.get('/:id',getPost);

//delete post
postsRoutes.delete('/:id',isLogin,deletePost);

//update post
postsRoutes.put('/:id',isLogin,updatePost);

//like post
postsRoutes.put('/likes/:id',isLogin,likePost);

//dislike post
postsRoutes.put('/dislikes/:id',isLogin,dislikePost);

//increment claps
postsRoutes.put('/claps/:id',isLogin,claps);

//schedule post
postsRoutes.put('/schedule/:id',isLogin,schedulePost);

//view post
postsRoutes.put('/:id/post-view-count',isLogin,postViewCount);





module.exports=postsRoutes;