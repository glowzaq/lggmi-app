import { Router } from 'express'
import {
    create, getApproved, getAll, getByUser,
    getOne, update, approve, reject,
    remove, getStats,
} from './testimonies.controller'
import { protect } from '../../middleware/auth.middleware'
import { restrictTo } from '../../middleware/role.middleware'

const router = Router()

router.use(protect)

router.get('/approved', getApproved)
router.get('/user/:userId', getByUser)
router.post('/', create)
router.get('/', getAll)
router.get('/stats', restrictTo('PASTOR', 'ADMIN', 'WORKER'), getStats)
router.get('/:id', getOne)
router.patch('/:id', update)

router.patch('/:id/approve', restrictTo('PASTOR', 'ADMIN'), approve)
router.patch('/:id/reject', restrictTo('PASTOR', 'ADMIN'), reject)

router.delete('/:id', restrictTo('ADMIN'), remove)

export default router