const dotenv=require('dotenv');
const cloudinary=require('cloudinary');
const{CloudinaryStorage}=require('multer-storage-cloudinary')
dotenv.config()

//config cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

//instance of cloudinary storage
const storage=new CloudinaryStorage({
    cloudinary,
    allowedFormates:["jpg","png","jpeg"],
    params:{
        folder:"blogify-api",
        transformation:[{width:500,heiht:500,crop:'limit'}]
    }
})

module.exports=storage