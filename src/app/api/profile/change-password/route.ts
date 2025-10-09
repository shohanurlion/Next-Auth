import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModels";
import { NextResponse } from "next/server";
import { getDatafromToken } from "@/helpers/getDatafromToken";
import bcrypt from 'bcryptjs';

connect();

export async function POST(request: Request) {
    try {
        const reqBody = await request.json();
        const { currentPassword, newPassword } = reqBody;
        
        // Get user ID from token
        const userId = await getDatafromToken(request as any);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized", status: 401 });
        }

        // Validation
        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Current and new passwords are required", status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ message: "New password must be at least 6 characters", status: 400 });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found", status: 404 });
        }

        // Check current password
        const isPasswordCorrect = await user.comparePassword(currentPassword);
        if (!isPasswordCorrect) {
            return NextResponse.json({ message: "Current password is incorrect", status: 400 });
        }

        // Update password using the dedicated method
        await user.updatePassword(newPassword);

        return NextResponse.json({ 
            message: "Password changed successfully", 
            status: 200 
        });

    } catch (error: any) {
        console.error('Error in change password API:', error);
        return NextResponse.json({ message: "Internal Server Error", status: 500 });
    }
}