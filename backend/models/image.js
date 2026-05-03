import mongoose from "mongoose"

const imageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    // File info
    orignialName: { type: String },  
    size: { type: Number },       
    label: { type: String, default: "uncategorized" }, 
    url: { type: String },           
    publicId: { type: String },     

}, { timestamps: true }) 

export default mongoose.model("images", imageSchema)