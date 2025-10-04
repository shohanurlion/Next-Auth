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
        //validation
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({message : "User does not exists", status: 400})
        }
        const isPasswordCorrece = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrece){
            return NextResponse.json({message : "Invalid Credentials", status: 400})
        }
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
        console.log(error)
        return NextResponse.json({message: "Internal Server Error", status: 500})
        }
}