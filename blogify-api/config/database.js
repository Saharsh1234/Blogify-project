//function for connecting to the database
const mongoose=require('mongoose');

const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to database");
    }
    catch(error){
        console.log("connection failed",error.message);
    }
}

module.exports=connectDB;