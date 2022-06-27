require('dotenv').config();//whatever thing in .env can be accessed by this file

//MongoDB connection
const mongoose=require('mongoose');


function connectDB(){
    //Database Connection
    mongoose.connect(process.env.MONGO_CONNECTION_URL);//{useNewUrlParser:true,useCreateIndex:true,useUnifiedToplogy:true,useFindAndModify:true});
    //url is the connection string provided by cloud mongoDB

    const connection=mongoose.connection;

    connection.once('open',()=>{
        console.log('Database Connected');
    });
    connection.on('error',()=>{
        console.log('connection failed');
    });
}

module.exports=connectDB;