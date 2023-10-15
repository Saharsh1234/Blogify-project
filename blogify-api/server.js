const dotenv=require('dotenv')
dotenv.config();
const cors=require('cors')
const http=require('http');
const express=require('express');
const { log } = require('console');
const userRoutes = require('./routes/users/userRoutes');
const categoryRoutes=require('./routes/category/categoryRoutes');
const connectDB=require('./config/database');
const { globalErrorHandler, not_found_url } = require('./middlewares/globalErrorHandler');
const postsRoutes = require('./routes/posts/postsRoutes');
const commentRoutes = require('./routes/comment/commentRoutes');
const sendEmail = require('./utils/sendEmail');





//connection to database
connectDB();

//declaring the server
const app=express();
const server=http.createServer(app);

//middlewares
app.use(express.json()) //pass incoming data
app.use(cors())

//routes
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/posts',postsRoutes);
app.use('/api/v1/comments',commentRoutes)


//URL not found error
app.use(not_found_url)

//handeling error
app.use(globalErrorHandler)

//starting the server
const PORT=process.env.PORT||9080;
server.listen(PORT,console.log('server is running'));