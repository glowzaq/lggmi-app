import { Router } from 'express'
import {
    create,
    getApproved,
    getAll,
    getByUser,
    getOne,
    update,
    approve,
    reject,
    remove,
    getStats,
} from './testimonies.controller'
import { protect } from '../../middleware/auth.middleware'
import { restrictTo } from '../../middleware/role.middleware'

const router = Router()

router.use(protect)

// ── Named static routes FIRST ─────────────────────────────────
router.get('/approved', getApproved)
router.get('/stats', restrictTo('PASTOR', 'ADMIN', 'WORKER'), getStats)
router.get('/user/:userId', getByUser)
router.get('/', restrictTo('PASTOR', 'ADMIN', 'WORKER'), getAll)
router.post('/', create)

// ── Dynamic :id routes LAST ───────────────────────────────────
router.get('/:id', getOne)
router.patch('/:id', update)
router.patch('/:id/approve', restrictTo('PASTOR', 'ADMIN'), approve)
router.patch('/:id/reject', restrictTo('PASTOR', 'ADMIN'), reject)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router