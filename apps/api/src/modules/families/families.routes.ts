import { Router } from 'express'
import { getAll, create, remove } from './families.controller'
import { protect } from '../../middleware/auth.middleware'
import { restrictTo } from '../../middleware/role.middleware'

const router = Router()

router.use(protect)

router.get('/', getAll)
router.post('/', restrictTo('ADMIN'), create)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router