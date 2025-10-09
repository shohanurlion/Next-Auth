import User from '@/models/userModels';
import { Resend } from 'resend';
// Remove bcrypt import to avoid conflicts with dynamic import
// import bcrypt from 'bcryptjs';

// Define the interface for email parameters
interface SendEmailParams {
  email: string;
  emailType: string;
  userId: string;
}

/**
 * Sends an email for either verification or password reset
 * @param {SendEmailParams} params - The email parameters
 * @returns {Promise<any>} The email response from Resend
 */
export const sendEmail = async ({email , emailType , userId}: SendEmailParams) => {
    try {
      // Use dynamic import to avoid conflicts with bcrypt
      const bcrypt = await import('bcryptjs');
      
      // Generate a secure hash token for email verification or password reset
      // This token is hashed before being stored in the database for security
      const hashtoken = await bcrypt.hash(userId.toString(), 12);
      
      // Update the user document with the appropriate token based on email type
      if(emailType === "VERIFY"){
        await User.findByIdAndUpdate(userId, {
          verifyToken: hashtoken, 
          verifyTokenExpiry: Date.now() + 3600000 // Token expires in 1 hour
        });
      } else if(emailType === "RESET"){
         await User.findByIdAndUpdate(userId, {
           forgetPasswordToken: hashtoken, 
           forgetPasswordExpiry: Date.now() + 3600000 // Token expires in 1 hour
         });
      }

      // Check if RESEND_API_KEY environment variable is set
      if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not set in environment variables');
      }

      // Initialize Resend client with API key
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      // Construct the reset and verification links with tokens
      const resetLink = `${process.env.DOMAIN}/reset-password?token=${hashtoken}`;
      const verifyLink = `${process.env.DOMAIN}/verifyemail?token=${hashtoken}`;
      
      // Prepare email content based on the email type
      const emailContent = emailType === "VERIFY" ? 
        {
          from: 'onboarding@resend.dev', // Using Resend's default verified domain
          to: email,
          subject: "Verify your email",
          html: `<h2>Email Verification</h2>
                 <p>Thank you for signing up. Please click the link below to verify your email address:</p>
                 <p><a href="${verifyLink}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
                 <p>If the button doesn't work, copy and paste this URL in your browser:</p>
                 <p>${verifyLink}</p>
                 <p><strong>This link will expire in 1 hour.</strong></p>`
        } :
        {
          from: 'onboarding@resend.dev', // Using Resend's default verified domain
          to: email,
          subject: "Reset your password",
          html: `<h2>Password Reset Request</h2>
                 <p>You requested to reset your password. Click the link below to reset it:</p>
                 <p><a href="${resetLink}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
                 <p>If the button doesn't work, copy and paste this URL in your browser:</p>
                 <p>${resetLink}</p>
                 <p><strong>This link will expire in 1 hour.</strong></p>
                 <p>If you didn't request this, please ignore this email.</p>`
        };
      
      console.log('Sending email to:', email);
      
      // Send the email using Resend API
      const emailRespond = await resend.emails.send(emailContent);
      console.log('Email sent successfully. Response:', JSON.stringify(emailRespond, null, 2));
      return emailRespond;

    } catch (error: any) {
      console.error('Error sending email:', error);
      // Log more detailed error information
      if (error.response) {
        console.error('Resend API Error Response:', error.response.data);
        // If it's a domain verification error, provide a more user-friendly message
        if (error.response.data?.message?.includes('verify a domain')) {
          console.log('Domain verification required. For testing, please use the email address associated with your Resend account.');
        }
      }
      throw error;
    }
};