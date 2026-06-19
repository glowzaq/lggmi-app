import { Router } from 'express'
import {
    create,
    getAll,
    getActive,
    getOne,
    update,
    remove,
    toggle,
} from './announcements.controller'
import { protect } from '../../middleware/auth.middleware'
import { restrictTo } from '../../middleware/role.middleware'

const router = Router()

router.use(protect)

// All logged in users see active announcements
router.get('/active', getActive)
router.get('/:id', getOne)

// Admin and pastor see all
router.get('/', restrictTo('PASTOR', 'ADMIN'), getAll)

// Admin only
router.post('/', restrictTo('ADMIN'), create)
router.patch('/:id', restrictTo('ADMIN'), update)
router.patch('/:id/toggle', restrictTo('ADMIN'), toggle)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router