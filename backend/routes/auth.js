import express from 'express'
import { authControllers, loginControllers } from '../controllers/auth.js'
import anyUserControllers from '../controllers/users.js'
import { anyAuthMiddleware } from '../middleweare/authVerify.js'

const authRouter = express.Router()

authRouter.post('/register', authControllers)
authRouter.post('/login', loginControllers)
authRouter.get('/myInfo', anyAuthMiddleware, anyUserControllers)

export default authRouter