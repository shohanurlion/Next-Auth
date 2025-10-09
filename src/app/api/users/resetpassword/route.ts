import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModels";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Connect to the MongoDB database
connect();

/**
 * POST handler for the reset password endpoint
 * This endpoint receives a token and new password, validates the token, 
 * and updates the user's password if valid
 * @param {Request} request - The incoming request object
 * @returns {NextResponse} JSON response with success or error message
 */
export async function POST(request: Request) {
    try {
        // Parse the request body to extract the token and new password
        const reqBody = await request.json();
        const { token, password } = reqBody;

        console.log('Reset password request received');
        console.log('Token:', token);
        console.log('New password length:', password?.length);

        // Validation: Check if both token and password are provided
        if (!token || !password) {
            console.log('Validation failed: Token or password missing');
            return NextResponse.json({ message: "Token and password are required", status: 400 });
        }

        // Validation: Check if password meets minimum length requirement
        if (password.length < 6) {
            console.log('Validation failed: Password too short');
            return NextResponse.json({ message: "Password must be at least 6 characters", status: 400 });
        }

        // Find user with the reset token that hasn't expired
        console.log('Searching for user with reset token');
        const user = await User.findOne({
            forgetPasswordToken: token,
            forgetPasswordExpiry: { $gt: Date.now() } // Check if token hasn't expired
        });

        // If no user found or token expired, return error
        if (!user) {
            console.log('User not found or token expired');
            return NextResponse.json({ message: "Invalid or expired token", status: 400 });
        }

        console.log('User found:', user.email);
        console.log('Current password in DB before update:', user.password);

        // Hash the new password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('New hashed password:', hashedPassword);

        // Update user document with new password and clear reset token fields
        // This ensures the token can't be used again (prevents replay attacks)
        const result = await User.updateOne(
            { _id: user._id },
            { 
                $set: {
                    password: hashedPassword,
                    forgetPasswordToken: undefined,
                    forgetPasswordExpiry: undefined
                }
            }
        );
        
        console.log('Update result:', result);

        // Check if the update was successful
        if (result.modifiedCount === 0) {
            console.log('Failed to update user password');
            return NextResponse.json({ message: "Failed to reset password", status: 500 });
        }

        console.log('Password reset successfully for user:', user.email);

        // Return success message
        return NextResponse.json({ 
            message: "Password reset successfully", 
            status: 200 
        });

    } catch (error: any) {
        // Handle any unexpected errors
        console.error('Error in reset password API:', error);
        console.error('Error stack:', error.stack);
        return NextResponse.json({ message: "Internal Server Error", status: 500 });
    }
}