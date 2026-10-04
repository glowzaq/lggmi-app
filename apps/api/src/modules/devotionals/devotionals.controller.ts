import { Request, Response } from 'express'
import {
    createDevotional,
    getTodayDevotional,
    getAllDevotionals,
    getDevotionalById,
    updateDevotional,
    deleteDevotional,
} from './devotionals.service'

export const create = async (req: Request, res: Response) => {
    try {
        const devotional = await createDevotional({
            ...req.body,
            createdById: req.user!.userId,
        })
        res.status(201).json({
            status: 'success',
            message: 'Devotional created',
            data: devotional,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getToday = async (req: Request, res: Response) => {
    try {
        const devotional = await getTodayDevotional()
        res.status(200).json({
            status: 'success',
            data: devotional ?? null,
        })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const devotionals = await getAllDevotionals()
        res.status(200).json({ status: 'success', data: devotionals })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const devotional = await getDevotionalById(id)
        res.status(200).json({ status: 'success', data: devotional })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const devotional = await updateDevotional(id, req.body)
        res.status(200).json({
            status: 'success',
            message: 'Devotional updated',
            data: devotional,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        await deleteDevotional(id)
        res.status(200).json({
            status: 'success',
            message: 'Devotional deleted',
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}