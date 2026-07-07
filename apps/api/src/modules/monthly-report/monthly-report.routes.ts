import { Router } from 'express'
import { create, getAll, getOne, update, remove } from './monthly-report.controller'
import { protect } from '../../middleware/auth.middleware'
import { restrictTo } from '../../middleware/role.middleware'

const router = Router()

router.use(protect)
router.use(restrictTo('PASTOR', 'ADMIN'))

router.get('/', getAll)
router.post('/', restrictTo('ADMIN'), create)
router.get('/:id', getOne)
router.patch('/:id', restrictTo('ADMIN'), update)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router