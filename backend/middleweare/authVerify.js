import ENV from '../constant/index.js'
import jwt from 'jsonwebtoken'
import sendResponse from '../constant/sendRespose.js'
import User from '../models/auth.js'



export async function anyAuthMiddleware(req, res, next) {
    try {
        const bearerToken = req?.headers?.authorization
        const token = bearerToken?.split(" ")[1]
        if (!token) return sendResponse(res, 403, null, true, "Token not Provide")
        const decoded = jwt.verify(token, process.env.AUTH_SECRET)
        if (decoded) {
            const user = await User.findById(decoded.id)
            if (!user) {
                return sendResponse(res, 403, null, true, "User Not Found")
            }
            req.user = decoded
            next()
        } else {
            return sendResponse(res, 500, null, true, "SomeThing Went Worng")
        }
    } catch (error) {
        return sendResponse(res, 500, null, true, "SomeThing Went Worng")
    }
}