import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModels";
import { NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

// Connect to the MongoDB database
connect();

/**
 * POST handler for the forgot password endpoint
 * This endpoint receives an email address and sends a password reset email if the user exists
 * @param {Request} request - The incoming request object
 * @returns {NextResponse} JSON response with success or error message
 */
export async function POST(request: Request) {
    try {
        // Parse the request body to extract the email
        const reqBody = await request.json();
        const { email } = reqBody;

        // Validation: Check if email is provided
        if (!email) {
            console.log('Forgot password request failed: Email is required');
            return NextResponse.json({ message: "Email is required", status: 400 });
        }

        console.log('Forgot password request received for email:', email);

        // Check if user exists in the database with the provided email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            // For security reasons, we don't reveal if the email exists or not
            // This prevents user enumeration attacks
            return NextResponse.json({ 
                message: "If your email is registered, you will receive a password reset link shortly", 
                status: 200 
            });
        }

        console.log('User found, generating reset token for:', email);

        // Generate reset token and send email to the user
        try {
            const resetToken = await sendEmail({
                email,
                emailType: "RESET",
                userId: user._id.toString()
            });
            console.log('Reset email sent successfully to:', email, 'Response:', JSON.stringify(resetToken, null, 2));
        } catch (emailError: any) {
            console.error('Failed to send reset email to:', email, 'Error:', emailError);
            
            // Check if it's a domain verification error (common in testing)
            if (emailError.response?.data?.message?.includes('verify a domain')) {
                // For testing purposes, we'll still return success but log the issue
                console.log('Domain verification issue - continuing with success response for testing');
                return NextResponse.json({ 
                    message: "If your email is registered, you will receive a password reset link shortly. Note: For testing, emails can only be sent to the account owner's email address.", 
                    status: 200 
                });
            }
            
            return NextResponse.json({ 
                message: "Failed to send reset email. Please try again later.", 
                status: 500 
            });
        }

        // Return success message
        return NextResponse.json({ 
            message: "If your email is registered, you will receive a password reset link shortly", 
            status: 200 
        });

    } catch (error: any) {
        // Handle any unexpected errors
        console.error('Error in forgot password API:', error);
        return NextResponse.json({ message: "Internal Server Error", status: 500 });
    }
}