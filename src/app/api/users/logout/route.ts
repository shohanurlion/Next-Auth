import { connect } from "@/dbconfig/dbconfig";
import { NextResponse, NextRequest } from "next/server";

connect();
export async function GET(request: Request) {
    try {
        const respons = NextResponse.json({message : "Logout Successful", success: true})
        respons.cookies.set("token", "", {httpOnly: true, secure: true, sameSite: "strict", maxAge: 0});
        return respons;
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error", status: 500})
    }
}                    