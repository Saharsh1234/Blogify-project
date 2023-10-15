const asyncHandler = require('express-async-handler');
const User = require('../../models/User/User');
const Post = require('../../models/Post/Post');
const Category = require('../../models/Category/Category');


//creating a post
exports.createPost = asyncHandler(async (req, res) => {
    //find the loged in user
    const postUser = await User.findById(req.uAuth._id)
    if (!postUser) {
        throw new Error('user not found')
    }
    //if account is not verified
    if (!postUser?.isVerified) {
        throw new Error('action denied, your account is not verified')
    }
    console.log(req.file);
    //get payload
    const { title, content, category } = req.body;

    //check if post allready exists
    const postFound = await Post.findOne({ title });
    if (postFound) {
        throw new Error('post allready exists');
    }

    //create post
    const post = await Post.create({
        title,
        content,
        category: category,
        author: req?.uAuth?._id
    })

    //associate post with user
    await User.findByIdAndUpdate(req?.uAuth?._id,
        {
            $push: { posts: post?._id }
        },
        {
            new: true
        })

    //push post into category
    await Category.findByIdAndUpdate(req?.uAuth?._id,
        {
            $push: { posts: post?._id }
        },
        {
            new: true
        })

    //send response
    res.status(201).json({
        // status:'success',
        message: 'posted successfully',
        // post
    })

})

//fetching all posts
exports.getPosts = asyncHandler(async (req, res) => {

    //get current time
    const currentTime = new Date();

    //query
    const query = {
        shedduledPublished: { $lte: currentTime },
        shedduledPublished: null
    }

    const posts = await Post.find(query).populate('category');


    res.status(201).json({
        status: 'success',
        message: 'posts fetched',
        posts
    })
})

//fetching post list
exports.getPosts = asyncHandler(async (req, res) => {

    //get current time
    const currentTime = new Date();

    //fetch the category
    const category = req.query.category
    //fetch the searchTerm
    const searchTerm = req.query.searchTerm

    //query
    let query = {
        shedduledPublished: { $lte: currentTime },
        shedduledPublished: null
    }

    //check if category exist,if yes push it into the query
    if (category) {
        query.category = category
    }
    //check if category exist,if yes push it into the query
    if (searchTerm) {
        query.title = { $regex: searchTerm, $options: "i" };
    }

    //Pagination parameters from request

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Post.countDocuments(query);

    const posts = await Post.find(query).populate('category').skip(startIndex).limit(limit);

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }


    res.status(201).json({
        status: 'success',
        message: 'posts fetched',
        pagination,
        posts
    })
})

//fetching one post
exports.getPost = asyncHandler(async (req, res) => {

    const post = await Post.findById(req.params.id).populate('author').populate('category').populate({
        path: "comments",
        model: "Comment",
        populate: {
            path: 'author',
            select: 'username'
        }
    });


    res.status(201).json({
        status: 'success',
        message: 'post fetched',
        post
    })
})

//deleting post
exports.deletePost = asyncHandler(async (req, res) => {

    //find the post
    const postFound = await Post.findById(req.params.id)
    const isAuthor = req.uAuth?._id.toString() === postFound?.author?._id.toString()
    if (!isAuthor) {
        throw new Error('Action denied, you are not the creater of this post')
    }
    await Post.findByIdAndDelete(req.params.id);


    res.status(201).json({
        status: 'successfully deleted',
        message: 'post deleted',
    })
})

//update post
exports.updatePost = asyncHandler(async (req, res) => {

    const post = await Post.findByIdAndUpdate(req.params.id
        , req.body,
        {
            new: true,
            runValidators: true
        });


    res.status(201).json({
        status: 'success',
        message: 'post updated',
        post
    })
})

//like post
exports.likePost = asyncHandler(async (req, res) => {
    //get the post id
    const postID = req.params.id
    //get the user id
    const userID = req.uAuth?._id

    //check id post is present in db
    const post = await Post.findById(postID);
    if (!post) {
        throw new Error('post does not exist')
    }

    //update the post's likes by pushing in the user ID
    await Post.findByIdAndUpdate(postID, {
        $addToSet: { likes: userID }
    },
        {
            new: true
        })

    //remove the user from dislike if the user has previously disliked the post
    post.dislikes = post.dislikes.filter((dislike) => dislike.toString() !== userID.toString());

    await post.save();

    res.status(200).json({
        message: 'post liked successfully',
        post
    })
})

//dislike post
exports.dislikePost = asyncHandler(async (req, res) => {
    //get the post id
    const postID = req.params.id
    //get the user id
    const userID = req.uAuth?._id

    //check id post is present in db
    const post = await Post.findById(postID);
    if (!post) {
        throw new Error('post does not exist')
    }

    //update the post's dislikes by pushing in the user ID
    await Post.findByIdAndUpdate(postID, {
        $addToSet: { dislikes: userID }
    },
        {
            new: true
        })

    //remove the user from like if the user has previously liked the post
    post.likes = post.likes.filter((like) => like.toString() !== userID.toString());

    await post.save();
    
    res.status(200).json({
        message: 'post liked successfully',
        post
    })
})

//post claps
exports.claps = asyncHandler(async (req, res) => {
    //get the post id
    const postID = req.params.id

    //find the post
    const post = await Post.findById(postID)

    if (!post) {
        throw new Error('post not found')
    }

    //increment the claps
    await Post.findByIdAndUpdate(postID,
        {
            $inc: { claps: 1 }
        },
        {
            new: true
        })

    res.status(200).json({
        message: 'claps updated successfully',
        post
    })
})

//schedule post
exports.schedulePost = asyncHandler(async (req, res) => {
    //get the payload
    const { schedulePublish } = req.body
    const { id } = req.params

    //check if post exists
    const post = await Post.findById(id);
    if (!post) {
        throw new Error('post not found')
    }

    //check if user is author of the post
    if (post.author.toString() !== req.uAuth?._id.toString()) {
        throw new Error('you cannot schedule the post as you are not the author')
    }

    //check if the schedule date is in the past
    const scheduleDate = new Date(schedulePublish)
    const currentDate = new Date()

    if (scheduleDate < currentDate) {
        throw new Error('date cannot be in the past')
    }

    //update the post
    post.shedduledPublished = schedulePublish

    post.save();

    res.status(200).json({
        message: 'post scheduled successfully',
        post
    })
})

//viewing a post
exports.postViewCount = asyncHandler(async (req, res)=>{
    //get the id of post
    const {id}=req.params;

    //get the login user
    const userID=req.uAuth._id;

    //find post
    const post=await Post.findById(id);
    if(!post){
        throw new Error("Post not found");
    }

    //push the user into postViews
    await Post.findByIdAndUpdate(
        id,
        {
            $addToSet:{postViews:userID}
        },
        {new:true}
    )
    await post.save();

    res.status(200).json({
        message: 'post viewed successfully',
        post
    })
    
})
