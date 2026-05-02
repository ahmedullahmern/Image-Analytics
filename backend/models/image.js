import mongoose from "mongoose"

const imageSchema = new mongoose.Schema({
    // Kiske image hai
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    // File info
    orignialName: { type: String },  // user ki original file name
    size: { type: Number },          // bytes mein (multer deta hai automatic)
    label: { type: String, default: "uncategorized" }, // user khud dega
    url: { type: String },           // cloudinary URL
    publicId: { type: String },      // cloudinary public id (delete ke liye)

}, { timestamps: true }) // createdAt, updatedAt automatic!

export default mongoose.model("images", imageSchema)