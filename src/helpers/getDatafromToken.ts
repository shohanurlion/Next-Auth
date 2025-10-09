import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';


export const getDatafromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || "";
        console.log('Token from cookies:', token);
        
        if (!token) {
            console.log('No token found in cookies');
            return null;
        }
        
        const decodedToken:any = jwt.verify(token, process.env.TOKEN_SECRET!);
        console.log('Decoded token:', decodedToken);
        return decodedToken.id;
    } catch (error) {
        console.log('Error decoding token:', error);
        return null;
    }
}