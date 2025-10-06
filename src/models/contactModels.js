import moongoose from "mongoose";

const contactSchema = new moongoose.Schema({
    name: {
         type: String, 
         required:[true , "Plz Enter Your Name"]
            },
    email: {
            type: String,
            required:[true , "Plz Enter Your Email"]
            },
    message: {
            type: String,
            required:[true , "Plz Enter Your Message"]
            },
    createdAt: { 
            type: Date, 
            default: Date.now   
            }
}); 
const Contact = moongoose.model.contacts || moongoose.model("contacts", contactSchema);
export default Contact;