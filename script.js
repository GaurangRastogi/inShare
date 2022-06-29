const File=require('./models/file');
const fs=require('fs');
const connectDB=require('./config/db');
connectDB();
async function fetchData(){
    //24 hours old file to be fetched from database
    const pastDate=new Date(Date.now()-(1000*60*60*24) /*24 hours*/);
    const files=await File.find({createdAt:{$lt:pastDate/*someData*/}});
    if(files.length){
        for(const file of files){
            try{
                //Delete from upload folder
                fs.unlinkSync(file);
                //Delete from Database
                await file.remove();
                console.log(`Successfully Deleted ${file.filename}`);
            }
            catch(err){
                console.log(`Error while deleting file ${err}`);
            }
        }
        console.log('Job Done');
    }
}

fetchData().then(process.exit);

/*
    go to heroku schedular
    create job -> run 'node script.js' every day at 2 AM
*/