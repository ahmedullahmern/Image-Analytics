import { v2 as cloudinary } from 'cloudinary'
import fsExtra from 'fs-extra'
import Image from '../models/image.js'
import ENV from '../constant/index.js'
import sendResponse from '../constant/sendRespose.js'

cloudinary.config({
    cloud_name: ENV.CLOUD_NAME,
    api_key: ENV.API_KEY,
    api_secret: ENV.API_SECRET,
})
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({
            success: false, message: "Image select karo"
        })

        const { label } = req.body
        const userId = req.user.id 
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "xis-images"
        })

        fsExtra.removeSync(req.file.path)

        const image = await Image.create({
            userId,
            originalName: req.file.originalname, 
            size: req.file.size,               
            label: label || "uncategorized",
            url: result.secure_url,            
            publicId: result.public_id          
        })

        sendResponse(res, 201, image, false, "Image uploaded successfully")
    } catch (error) {
        sendResponse(res, 500, null, true, error.message)
    }
}


export const getMyImages = async (req, res) => {
    try {
        const userId = req.user.id
        const page = parseInt(req.query.page) || 1   
        const limit = parseInt(req.query.limit) || 10 

        const skip = (page - 1) * limit

        const total = await Image.countDocuments({ userId })
        const images = await Image.find({ userId })
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(limit)

        sendResponse(res, 200, {
            images,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }, false, "Images fetched successfully")

    } catch (error) {
        sendResponse(res, 500, null, true, error.message)
    }
}