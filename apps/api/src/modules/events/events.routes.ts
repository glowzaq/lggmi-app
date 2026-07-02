import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { create, getEvent, getEvents, getStats, getUpcoming, remove, update } from "./events.controller";
import { restrictTo } from "../../middleware/role.middleware";

const router = Router()
router.use(protect)
router.get('/stats', restrictTo('PASTOR', 'ADMIN', 'WORKER'), getStats)
router.get('/upcoming', getUpcoming)
router.get('/', restrictTo('PASTOR', 'ADMIN', 'WORKER'), getEvents)

router.post('/', restrictTo('ADMIN', 'WORKER'), create)
router.get('/:id', getEvent)

router.patch('/:id', restrictTo('ADMIN'), update)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router