import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import { getMember, getMembers, getProfile, getStats, removeMember, updateMemberProfile } from "./members.controller";

const router = Router()

router.use(protect)

router.get('/me', getProfile)

router.get('/stats', restrictTo('PASTOR', 'ADMIN'), getStats)
router.get('/', restrictTo('PASTOR', 'ADMIN'), getMembers)

router.delete('/:id', restrictTo('ADMIN'), removeMember)

router.get('/:id', getMember)
router.patch('/:id', updateMemberProfile)

export default router