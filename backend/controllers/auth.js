import sendResponse from "../constant/sendRespose.js";
import User from "../models/auth.js";
import jwt from 'jsonwebtoken'
import { loginSchema, signupSchema } from "../validation/authValidation.js";
import bcrypt from 'bcrypt'
import ENV from '../constant/index.js'

const authControllers = async (req, res) => {
    try {
        const { error, value } = signupSchema.validate(req.body);
        if (error) return sendResponse(res, 400, null, true, error.message)
        const user = await User.findOne({ email: value.email }).lean()
        if (user) return sendResponse(res, 403, null, true, "User With This Email already Exist")
        const hashedPassword = await bcrypt.hash(value.password, 12)
        value.password = hashedPassword;
        let newUser = new User({ ...value });
        var token = jwt.sign({ id: newUser._id, name: newUser.name, email: newUser.email, }, ENV.AUTH_SECRET);
        newUser = await newUser.save()
        sendResponse(res, 201, { newUser, token }, false, "User Register successfully")
    } catch (error) {
        sendResponse(res, 400, null, true, error.message)
        console.log("errror-->", error)
    }
};

const loginControllers = async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return sendResponse(res, 400, null, true, error.message)
    const user = await User.findOne({ email: value.email }).lean()
    if (!user) return sendResponse(res, 403, null, true, "User not Registered.")
    const isPasswordValid = await bcrypt.compare(value.password, user.password)
    if (!isPasswordValid) return sendResponse(res, 403, null, true, "Invalid  Credentails")
    var token = jwt.sign({ id: user._id, email: user.email, name: user.name }, ENV.AUTH_SECRET);
    sendResponse(res, 200, { user, token }, false, "User Login successfully")
}


export { authControllers, loginControllers }