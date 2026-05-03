import sendResponse from '../constant/sendRespose.js'
import Image from '../models/image.js'
import mongoose from 'mongoose'

export const getTotalCount = async (req, res) => {
    try {
        const userId = req.user.id
        const total = await Image.countDocuments({ userId })

        sendResponse(res, 200, { total }, false, "Total count fetched successfully")
    } catch (error) {
        sendResponse(res, 500, null, true, error.message)
    }
}

export const getByDate = async (req, res) => {
    try {
        const userId = req.user.id
        const data = await Image.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId) // 🔥 FIX
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d", // 2024-01-15
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 } // count karo
                }
            },

            { $sort: { _id: 1 } }
        ])

     
        sendResponse(res, 200, data, false, "Images by date fetched successfully")

    } catch (error) {
        sendResponse(res, 500, null, true, error.message)
    }
}

export const getByLabel = async (req, res) => {
    try {
        const userId = req.user.id

        const data = await Image.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: "$label",    
                    count: { $sum: 1 } 
                }
            }
        ])

       
        sendResponse(res, 200, data, false, "Images by label fetched successfully")
    } catch (error) {
        sendResponse(res, 500, null, true, error.message)
    }
}


// analytics.js controller mein add karo

export const filterByDate = async (req, res) => {
    try {
        const userId = req.user.id
        const { date } = req.query
        // ?date=2024-01-15

        if (!date) return res.status(400).json({
            success: false,
            message: "Date do bhai! ?date=2024-01-15"
        })

        // Us din ki start aur end banao
        const startDate = new Date(date)          // 2024-01-15 00:00:00
        const endDate = new Date(date)
        endDate.setDate(endDate.getDate() + 1)    // 2024-01-16 00:00:00

        const images = await Image.find({
            userId: new mongoose.Types.ObjectId(userId),
            createdAt: {
                $gte: startDate,   // is se bada ya equal
                $lt: endDate       // is se chota
            }
        })
        if (images?.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Is date par koi images nahi mili",
                data: []
            })
        }
        sendResponse(res, 200, images, false,
            images.length === 0
                ? "No images found for this date"
                : "Images filtered successfully"
        )
    } catch (error) {
        sendResponse(res, 500, null, true, error.message)
    }
}