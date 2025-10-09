import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the user schema with all required fields
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
    // Fields for password reset functionality
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date, 
    // Fields for email verification
    verifyToken: String,
    verifyTokenExpiry: Date 
});

// Pre-save middleware to hash passwords before saving to database
// This ensures passwords are never stored in plain text
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        console.log('Password not modified, skipping hash');
        return next();
    }
    
    console.log('Password modified, hashing password');
    console.log('Password before hashing:', this.password);
    
    // Hash the password with bcrypt using 10 salt rounds
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    console.log('Password after hashing:', this.password);
    next();
});

// Method to compare a candidate password with the stored hashed password
// Used during login to verify user credentials
userSchema.methods.comparePassword = async function(candidatePassword) {
    console.log('Comparing passwords:');
    console.log('Candidate password:', candidatePassword);
    console.log('Stored password:', this.password);
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update user password
// This method sets a new password and saves the user document
// The pre-save hook will automatically hash the new password
userSchema.methods.updatePassword = async function(newPassword) {
    console.log('Updating password with updatePassword method');
    console.log('New password:', newPassword);
    // Set the password directly (pre-save hook will hash it)
    this.password = newPassword;
    return await this.save();
};

// Create or retrieve the User model
// This prevents OverwriteModelError when in development with hot reloading
const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;