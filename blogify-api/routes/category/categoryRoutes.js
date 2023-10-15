const express=require('express');
const isLogin = require('../../middlewares/isLogin');
const { createCategory,getCategory,deleteCategory,updateCategory } = require('../../controller/category/categoryCtrl');




const categoryRoutes=express.Router();

//create a category
categoryRoutes.post('/',isLogin,createCategory)

//fetch category
categoryRoutes.get('/',getCategory)

//delete category
categoryRoutes.delete('/:id',isLogin,deleteCategory)

//update category
categoryRoutes.put('/:id',isLogin,createCategory)

module.exports=categoryRoutes;