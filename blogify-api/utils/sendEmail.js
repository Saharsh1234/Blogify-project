const dotenv=require('dotenv');
const nodemailer=require('nodemailer');
dotenv.config();

//sending email
const sendEmail=async(to,resetToken)=>{
    try {
        //create transport
        const transport=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth:{
                user:process.env.GMAIL_USER,
                pass:process.env.GMAIL_PASS
            }
        })

        //creat message
        const message={
            to,
            subject:'password rest',
            html:
            `<p>You are receiving this email because you (or someone else) have requested the reset of a password.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <p>https://localhost:3000/reset-password/${resetToken}</p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `
        }

        //send the email
        const info=await transport.sendMail(message);
        console.log("email sent",info.messageId);

    } catch (error) {
        console.log(error);
        throw new Error("Email sending failed");
    }
}

module.exports=sendEmail;