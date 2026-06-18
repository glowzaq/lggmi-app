import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { create, getEvent, getEvents, getStats, getUpcoming, remove, update } from "./events.controller";
import { restrictTo } from "../../middleware/role.middleware";

const router = Router()
router.use(protect)
router.get('/upcoming', getUpcoming)
router.get('/:id', getEvent)

router.get('/stats', restrictTo('PASTOR', 'ADMIN'), getStats)
router.get('/', restrictTo('PASTOR', 'ADMIN'), getEvents)

router.post('/', restrictTo('ADMIN'), create)
router.patch('/:id', restrictTo('ADMIN'), update)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router