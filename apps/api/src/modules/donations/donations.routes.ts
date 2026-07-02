import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import { create, getAll, getByUser, getOne, getStats, remove, update } from "./donations.controller";

const router = Router()
router.use(protect)

router.get('/stats', restrictTo('PASTOR', 'ADMIN'), getStats)
router.get('/user/:userId', getByUser)
router.get('/', restrictTo('PASTOR', 'ADMIN'), getAll)
router.post('/', restrictTo('ADMIN', 'WORKER'), create)
router.get('/:id', restrictTo('PASTOR', 'ADMIN', 'WORKER'), getOne)


router.patch('/:id', restrictTo('ADMIN'), update)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router