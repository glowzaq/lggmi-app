import { Router } from 'express'
import {
    create, getAll, getOne,
    update, remove, getStats,
} from './welfare.controller'
import { protect } from '../../middleware/auth.middleware'
import { restrictTo } from '../../middleware/role.middleware'

const router = Router()

router.use(protect)
router.use(restrictTo('PASTOR', 'ADMIN', 'WORKER'))

router.get('/stats', getStats)
router.get('/', getAll)
router.post('/', restrictTo('ADMIN', 'WORKER'), create)
router.get('/:id', getOne)
router.patch('/:id', restrictTo('ADMIN'), update)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router