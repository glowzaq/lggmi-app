import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { restrictTo } from "../../middleware/role.middleware";
import { getUser, getUsers, getStats, removeUser, updateUserProfile } from "./users.controller";

const router = Router()

router.use(protect)

router.get('/stats', restrictTo('PASTOR', 'ADMIN', 'WORKER'), getStats)
router.get('/', restrictTo('PASTOR', 'ADMIN', 'WORKER'), getUsers)
// router.post('/', restrictTo('ADMIN', 'WORKER'), createUser)

router.delete('/:id', restrictTo('ADMIN'), removeUser)

router.get('/:id', getUser)
router.patch('/:id', updateUserProfile)

export default router