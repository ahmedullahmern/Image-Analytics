import { Router } from 'express'
import { getTotalCount, getByDate, getByLabel, filterByDate } from '../controllers/analytics.js'
import { anyAuthMiddleware } from '../middleweare/authVerify.js'

const router = Router()

// Sab protected
router.get('/count', anyAuthMiddleware, getTotalCount)
router.get('/bydate', anyAuthMiddleware, getByDate)
router.get('/bylabel', anyAuthMiddleware, getByLabel)
router.get('/filterbydate', anyAuthMiddleware, filterByDate)


export default router