import { Router } from 'express'
import {
    create,
    getAll,
    getPublic,
    getByMember,
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
router.get('/stats', restrictTo('PASTOR', 'ADMIN'), getStats)
router.get('/member/:memberId', getByMember)
router.get('/', restrictTo('PASTOR', 'ADMIN'), getAll)
router.post('/', create)
router.get('/:id', getOne)
router.patch('/:id', update)

router.patch('/:id/status', restrictTo('PASTOR', 'ADMIN'), updateStatus)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router