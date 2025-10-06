import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModels";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { getDatafromToken } from "@/helpers/getDatafromToken";

connect();
export async function POST(request: Request) {
const userId = await getDatafromToken(request as any);
const user = await User.findById({_id:userId}).select("-password");
return NextResponse.json({message : "User data fetched successfully", success: true, user})
}