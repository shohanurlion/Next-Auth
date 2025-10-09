import mongoose from "mongoose"

/**
 * Connects to the MongoDB database using the connection string from environment variables
 * Sets up event listeners for connection success and error handling
 */
export async function connect() {
    try {
        // Connect to MongoDB using the MONGO_URL environment variable
        mongoose.connect(process.env.MONGO_URL!)
        const connection = mongoose.connection
        
        // Event listener for successful database connection
        connection.on("connected", ()=>{
            console.log("Database connected successfully")
        })
        
        // Event listener for database connection errors
        connection.on("error", ()=>{
            console.log("Database connection failed")
        })
    } catch (error) {
        console.log("Database connection failed")
        console.log(error)
    }
    
}