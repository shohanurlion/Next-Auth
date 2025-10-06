import { connect } from "@/dbconfig/dbconfig";
import { NextResponse } from "next/server";
import Contact from "@/models/contactModels";

connect();
export async function POST(request: Request) {
    try {
        const reqBody = await request.json();
        const {name, email ,message} = reqBody;
        //validation
        const newMessage = new Contact({
            name,
            email,
            message
        });
        
        const saveMassage = await newMessage.save();
        console.log("New Message Received: ", saveMassage);
        return NextResponse.json({message : "Message received successfully", status: 201, newMessage})  
        }catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error", status: 500})
    }     }