import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModels";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { getDatafromToken } from "@/helpers/getDatafromToken";

connect();
export async function POST(request: Request) {
    try {
        const userId = await getDatafromToken(request as any);
        console.log('User ID from token:', userId);
        
        if (!userId) {
            console.log('No user ID found in token');
            return NextResponse.json({message : "Unauthorized", status: 401});
        }
        
        const user = await User.findById({_id:userId}).select("-password");
        console.log('User found:', user);
        
        if (!user) {
            console.log('User not found in database');
            return NextResponse.json({message : "User not found", status: 404});
        }
        
        return NextResponse.json({message : "User data fetched successfully", success: true, user});
    } catch (error) {
        console.log('Error in me route:', error);
        return NextResponse.json({message: "Internal Server Error", status: 500});
    }
}