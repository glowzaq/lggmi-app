import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import { bulkMark, getByEvent, getByMember, getStats, mark } from "./attendance.controller";

const router = Router()
router.use(protect)

router.get('/stats', restrictTo('ADMIN', 'PASTOR'), getStats)

router.get('/event/:eventId', restrictTo('ADMIN', 'PASTOR'), getByEvent)
router.get('/member/:memberId', getByMember)

router.post('/', restrictTo('ADMIN'), mark)
router.post('/bulk', restrictTo('ADMIN'), bulkMark)

export default router