import { Request, Response } from 'express'
import { getAllFamilies, createFamily, deleteFamily } from './families.service'

export const getAll = async (req: Request, res: Response) => {
    try {
        const families = await getAllFamilies()
        res.status(200).json({ status: 'success', data: families })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        const { name } = req.body
        if (!name) {
            res.status(400).json({ status: 'error', message: 'Name is required' })
            return
        }
        const family = await createFamily(name)
        res.status(201).json({
            status: 'success',
            message: 'Family group created',
            data: family,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        await deleteFamily(String(id))
        res.status(200).json({
            status: 'success',
            message: 'Family group deleted',
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}