import { Router } from 'express'
import multer from 'multer'
import { uploadImage ,getMyImages} from '../controllers/image.js'
import { anyAuthMiddleware } from '../middleweare/authVerify.js'

const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix}-${file.originalname}`)
    }
})

// const fileFilter = (req, file, cb) => {
//     const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jfif']
//     if (allowed.includes(file.mimetype)) {
//         cb(null, true)   // allow karo
//     } else {
//         cb(new Error('Sirf JPG, PNG, WEBP images allowed hain!'), false)
//     }
// }

const upload = multer({
    storage: storage
})


// Dono routes protected hain
router.post('/upload', anyAuthMiddleware, upload.single('image'), uploadImage)
router.get('/', anyAuthMiddleware, getMyImages)

export default router