import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { create, getAll, getLatest, getOne, getSeries, remove, update } from "./sermons.controller";
import { restrictTo } from "../../middleware/role.middleware";

const router = Router()
router.use(protect)
router.get('/latest', getLatest)
router.get('/series', getSeries)
router.get('/', getAll)
router.get('/:id', getOne)

router.post('/', restrictTo('ADMIN'), create)
router.patch('/:id', restrictTo('ADMIN'), update)
router.delete('/:id', restrictTo('ADMIN'), remove)

export default router