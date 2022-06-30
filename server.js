const express=require('express');
const app=express();
const path=require('path');
const cors=require('cors');
const PORT=process.env.PORT||3000;  //If process env has any port given to  it in .env, otherwise give port 3000
//to use static files
app.use(express.static('public'));
//MiddleWare called,cause request is sending json data,and this middleware help express to read it
app.use(express.json());
const connnectDB=require('./config/db');
connnectDB();


//Cors
const corsOptions={
    //origin: process.env.ALLOWED_CLIENTS.split(','),  
    origin:'http://localhost:3000',
}
app.use(cors(corsOptions));

//template Engine ->default location of views
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');

//Routes
//so whenever anyone call localhost/api/files it'll import -> ./routes/files
app.use('/api/files',require('./routes/files'));

//Route2 for download files, since in above we gave only download-file link
app.use('/files',require('./routes/show'));

//Route3 for download
app.use('/files/download/',require('./routes/download'));


app.listen(PORT, ()=>{
    console.log(`Listening to the port ${PORT}`);
})