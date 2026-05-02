import { v2 as cloudinary } from 'cloudinary'
import fsExtra from 'fs-extra'
import Image from '../models/image.js'
import ENV from '../constant/index.js'

// Cloudinary config
cloudinary.config({
    cloud_name: ENV.CLOUD_NAME,
    api_key: ENV.API_KEY,
    api_secret: ENV.API_SECRET,
})
// Image Upload
export const uploadImage = async (req, res) => {
    try {
        // File aya?
        if (!req.file) return res.status(400).json({
            success: false, message: "Image select karo"
        })

        const { label } = req.body
        const userId = req.user.id // middleware ne set kiya
        // Cloudinary pe upload karo
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "xis-images"
        })

        // Local temp file delete karo
        fsExtra.removeSync(req.file.path)

        // MongoDB mein save karo (file nahi, sirf info!)
        const image = await Image.create({
            userId,
            originalName: req.file.originalname, // user ki file name
            size: req.file.size,                 // bytes (multer ne diya)
            label: label || "uncategorized",
            url: result.secure_url,              // cloudinary ka link
            publicId: result.public_id           // cloudinary id
        })

        res.status(201).json({
            success: true,
            message: "Image upload successfully",
            data: image
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Meri Saari Images (Pagination ke saath)

export const getMyImages = async (req, res) => {
    try {
        const userId = req.user.id
        const page = parseInt(req.query.page) || 1   // ?page=2
        const limit = parseInt(req.query.limit) || 10 // ?limit=5

        // Kitni skip karni hain
        const skip = (page - 1) * limit
        // Page 1: skip 0  → images 1-10
        // Page 2: skip 10 → images 11-20

        const total = await Image.countDocuments({ userId })
        const images = await Image.find({ userId })
            .sort({ createdAt: -1 }) // naya pehle
            .skip(skip)
            .limit(limit)

        res.status(200).json({
            success: true,
            data: {
                images,
                pagination: {
                    total,           // total kitni images
                    page,            // ab kaunsa page
                    limit,           // ek page mein kitni
                    totalPages: Math.ceil(total / limit)
                }
            }
        })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}