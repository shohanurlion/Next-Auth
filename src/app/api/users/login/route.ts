import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModels";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


connect();
export async function POST(request: Request) {
    try {
        const reqBody = await request.json();
        const {email ,password} = reqBody;
        
        console.log('Login request received for email:', email);
        
        //validation
        const user = await User.findOne({email});
        if(!user){
            console.log('User not found for email:', email);
            return NextResponse.json({message : "User does not exists", status: 400})
        }
        
        console.log('User found:', user.email);
        console.log('Password provided for login:', password);
        console.log('Hashed password in DB:', user.password);
        
        // Compare password directly with bcrypt
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isPasswordCorrect);
        
        if(!isPasswordCorrect){
            console.log('Invalid credentials for user:', email);
            return NextResponse.json({message : "Invalid Credentials", status: 400})
        }
        
        console.log('Login successful for user:', email);
        
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        }
       const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "7d"});
      const respons = NextResponse.json({message : "Login Successful", success: true})
      respons.cookies.set("token", token, {httpOnly: true, secure: true, sameSite: "strict", maxAge: 7*24*60*60});
      return respons;

    }catch (error) {
        console.log('Error in login API:', error)
        return NextResponse.json({message: "Internal Server Error", status: 500})
        }
}