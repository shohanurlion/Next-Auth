import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModels";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { sendEmail } from "@/helpers/mailer";


connect();
export async function POST(request: Request) {
    try {
        const reqBody = await request.json();
        const {username, email ,password} = reqBody;
        //validation
        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({message : "User already exists", status: 400})
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        const saveUser = await newUser.save();
        console.log("New User Created: ", saveUser);

        //Email send notification
        await sendEmail({email, emailType: "VERIFY", userId: saveUser._id})
        return NextResponse.json({message : "User created successfully, Please verify your email", status: 201, saveUser})
        
    }catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error", status: 500})
    }
}          