const router=require('express').Router();
const multer=require('multer');
const path=require('path');
const File=require('../models/file');
const {v4:uuid4}=require('uuid');
let storage=multer.diskStorage({
        destination:(req,file,cb)=>cb(null,'uploads/'),
        filename:(req,file,cb)=>{
            const uniqueName= `${Date.now()}-${Math.random()*1E9}${path.extname(file.originalname)}`;
            cb(null,uniqueName);
        }
});
let upload=multer({
    storage,
    limit:{fileSize:1000000*100},
}).single('myfile'); 


router.post('/',(req,res)=>{
    //Files incoming to be stored ->in uploads folder
    upload(req,res,async (err)=>{
        //Validate Request
        if(!req.file){
            return res.json({error:'All fields are required'});
        }
        if(err){
            return res.status(500).send({error:err.message});
        }
        else{
             //Store into database,see what we're exporting from ./models/files 
            const file=new File({
                filename:req.file.filename,
                uuid:uuid4(),
                path:req.file.path,
                size:req.file.size,
            });
            const response=await file.save();
            return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});
            //http://localhost:3000/files/'uuid' 
        }
    });
});
router.post('/send',async (req,res)=>{
    //getting parameters we sent
    const {uuid,emailTo,emailFrom}=req.body;
    //Validate Request
    if(!uuid||!emailTo||!emailFrom)
        return res.status(422).send(`${{ error: 'All fields required' }}\n${req.body}`);
    
    //Get data from database
    const file=await  File.findOne({uuid:uuid});
    if(file.sender){
        return res.status(422).send({error:'Email already sent'});
    }
    file.sender=emailFrom;
    file.receiver=emailTo;
    const response=await file.save();
    
    //Sending email-> since it uses SMTP request therefore writing email in different file
    const sendMail=require('../services/emailService');
    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:'Inshare file Sharing',
        text:`${emailFrom} shared a file with you`,
        html:require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000)+'KB',
            expires:'24 hours',
        })
    });
    return res.send({success:true});
});


module.exports=router;