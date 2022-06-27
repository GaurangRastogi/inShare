const nodemailer=require('nodemailer');
async function sendMail({from,to,subject,text,html}){
    //SMTP Set Up
    let transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,
        //if secure is true give port-> 465
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
    });
    let info=await transporter.sendMail({
       from:`inShare <${from}>`,
       to: to,
       subject:subject,
       text:text,
       html:html
    });
    console.log(info);
}

module.exports=sendMail;