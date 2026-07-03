import { Router } from 'express'
import {
    logToday,
    getToday,
    getLogs,
    getStats,
    getCongregationStats,
} from './spiritual-growth.controller'
import { protect } from '../../middleware/auth.middleware'
import { restrictTo } from '../../middleware/role.middleware'

const router = Router()

router.use(protect)

router.get(
    '/congregation',
    restrictTo('PASTOR', 'ADMIN'),
    getCongregationStats
)

router.post('/', logToday)
router.get('/today/:userId', getToday)
router.get('/logs/:userId', getLogs)
router.get('/stats/:userId', getStats)

export default router