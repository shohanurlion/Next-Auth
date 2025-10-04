import User from '@/models/userModels';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

interface SendEmailParams {
  email: string;
  emailType: string;
  userId: string;
}

export const sendEmail = async ({email , emailType , userId}: SendEmailParams) =>{
    try {
      const hashtoken = await bcrypt.hash(userId.toString(), 12);
      if(emailType === "VERIFY"){
        await User.findByIdAndUpdate(userId, {verifyToken:hashtoken, verifyTokenExpiry: Date.now() + 3600000});
      }else if(emailType === "RESET"){
         await User.findByIdAndUpdate(userId, {forgetPasswordToken:hashtoken, forgetPasswordExpiry: Date.now() + 3600000});
      }

  const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});
const mailOptions = {
    from: 'liton@shohanur.ai',
    to: email,
    subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
    text: "Hello world?", // plain‑text body
    html: "<b>Hello world?</b>", // HTML body
  };
    const emailRespond = await transporter.sendMail(mailOptions);
    return emailRespond;

    }catch (error) {
        console.log(error)
    }                   



}