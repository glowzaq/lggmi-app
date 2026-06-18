import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import { create, getAll, getByMember, getOne, getStats, remove, update } from "./donations.controller";

const router = Router()
router.use(protect)

router.get('/stats', restrictTo('PASTOR', 'ADMIN'), getStats)
router.get('/', restrictTo('PASTOR', 'ADMIN'), getAll)
router.get('/:id', restrictTo('PASTOR', 'ADMIN'), getOne)

router.get('/member/:memberId', getByMember)

router.post('/', restrictTo('ADMIN'), create)
router.patch('/:id', restrictTo('ADMIN'), update)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router