import { Router } from 'express'
import {
    create, getActive, getAll,
    update, activate, remove,
} from './monthly-theme.controller'
import { protect } from '../../middleware/auth.middleware'
import { restrictTo } from '../../middleware/role.middleware'

const router = Router()

router.use(protect)

router.get('/active', getActive)

router.get('/', restrictTo('ADMIN'), getAll)
router.post('/', restrictTo('ADMIN'), create)
router.patch('/:id', restrictTo('ADMIN'), update)
router.patch('/:id/activate', restrictTo('ADMIN'), activate)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router