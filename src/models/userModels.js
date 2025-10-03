import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
         type: String, 
         required:[true , "Plz Enter Your UserName"]
         },
    email: { 
         type: String,
         required:[true , "plz Provide you Email"],
          unique: true
         },
    password: { 
         type: String,
         required:[true , "Plz Enter Your Password"] 
        },   
        isVarified: { 
         type: Boolean, 
         default: false 
        },
    isAdmin: { 
         type: Boolean, 
         default: false 
        },   
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date, 
    verifyToken: String,
    verifyTokenExpiry: Date 
}); 
const User = mongoose.model.users || mongoose.model("users", userSchema);
export default User;