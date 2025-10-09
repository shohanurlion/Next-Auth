import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModels";
import { NextResponse } from "next/server";

connect();

export async function POST(request: Request) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;

        // Validation
        if (!token) {
            return NextResponse.json({ message: "Token is required", status: 400 });
        }

        // Find user with the verification token
        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ message: "Invalid or expired token", status: 400 });
        }

        // Update user verification status and clear token fields
        user.isVarified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        
        await user.save();

        return NextResponse.json({ 
            message: "Email verified successfully", 
            status: 200 
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error", status: 500 });
    }
}