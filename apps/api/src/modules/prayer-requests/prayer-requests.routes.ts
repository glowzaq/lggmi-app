import { Router } from 'express'
import {
    create,
    getAll,
    getPublic,
    getByUser,
    getOne,
    update,
    remove,
    updateStatus,
    getStats,
} from './prayer-requests.controller'
import { protect } from '../../middleware/auth.middleware'
import { restrictTo } from '../../middleware/role.middleware'

const router = Router()

router.use(protect)

router.get('/public', getPublic)
router.get('/stats', restrictTo('PASTOR', 'ADMIN', 'WORKER'), getStats)
router.get('/user/:userId', getByUser)
router.get('/', restrictTo('PASTOR', 'ADMIN', 'WORKER'), getAll)
router.post('/', create)
router.get('/:id', getOne)
router.patch('/:id', update)

router.patch('/:id/status', restrictTo('PASTOR', 'ADMIN'), updateStatus)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router