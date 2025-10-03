import nodemailer from 'nodemailer';

interface SendEmailParams {
  email: string;
  emailType: string;
  userId: string;
}

export const sendEmail = async ({email , emailType , userId}: SendEmailParams) =>{
    try {
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