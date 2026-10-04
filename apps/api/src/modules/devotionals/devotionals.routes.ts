import { Router } from 'express'
import {
    create, getToday, getAll,
    getOne, update, remove,
} from './devotionals.controller'
import { protect } from '../../middleware/auth.middleware'
import { restrictTo } from '../../middleware/role.middleware'

const router = Router()

router.use(protect)

router.get('/today', getToday)

router.get('/', restrictTo('ADMIN', 'PASTOR'), getAll)
router.post('/', restrictTo('ADMIN'), create)
router.get('/:id', getOne)
router.patch('/:id', restrictTo('ADMIN'), update)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router