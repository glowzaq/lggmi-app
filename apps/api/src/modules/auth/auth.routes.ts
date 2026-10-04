import { Router } from 'express'
import { register, login, getMe, createWorker, resetPassword } from './auth.controller'
import { protect } from '../../middleware/auth.middleware'
import { restrictTo } from '../../middleware/role.middleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/create-worker', protect, restrictTo('ADMIN'), createWorker)
router.post(
    '/reset-password',
    protect,
    restrictTo('ADMIN'),
    resetPassword
)
router.get('/me', protect, getMe)

export default router