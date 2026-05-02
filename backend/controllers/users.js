import User from '../models/auth.js';
import sendResponse from '../constant/sendRespose.js';

const anyUserControllers = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.user._id
        })
        return sendResponse(res, 200, user, false, "User Updated Successfully")
    } catch (error) {
        return sendResponse(res, 500, null, true, error.message)
    }
}

export default anyUserControllers