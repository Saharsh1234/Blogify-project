const Category=require("../../models/Category/Category");
const asyncHandler=require('express-async-handler');

//creates a new category
exports.createCategory=asyncHandler(async (req,res)=>{
    const{name, author}=req.body;
    
    //if the catagory exists
    const categoryFound=await Category.findOne({name});
    if(categoryFound){
        throw new Error('category allready exists');
    } 

    //create category
    const category=await Category.create({
        name:name,
        author:req.uAuth?._id
    })
    res.status(201).json({
        status:'success',
        message:'category created',
        category
    })
})

//get all categories
exports.getCategory=asyncHandler(async (req,res)=>{

    const categories=await Category.find({});

    
    res.status(201).json({
        status:'success',
        message:'category fetched',
        categories
    })
})

//delete category
exports.deleteCategory=asyncHandler(async (req,res)=>{

    await Category.findByIdAndDelete(req.params.id);

    
    res.status(201).json({
        status:'successfully deleted',
        message:'category deleted',
    })
})

//update category
exports.updateCategory=asyncHandler(async (req,res)=>{

    const category=await Category.findByIdAndUpdate(req.params.id
        ,{
            name:req.body.name
        },
        {
            new: true,
            runValidators:true
        });

    
    res.status(201).json({
        status:'success',
        message:'category updated',
        category
    })
})
