import { Request, Response } from 'express'
import {
    createTestimony,
    getApprovedTestimonies,
    getAllTestimonies,
    getUserTestimonies,
    getTestimonyById,
    updateTestimony,
    approveTestimony,
    rejectTestimony,
    deleteTestimony,
    getTestimonyStats,
} from './testimonies.service'

export const create = async (req: Request, res: Response) => {
    try {
        const testimony = await createTestimony(req.body)
        res.status(201).json({
            status: 'success',
            message: 'Testimony submitted and awaiting approval',
            data: testimony,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getApproved = async (req: Request, res: Response) => {
    try {
        const testimonies = await getApprovedTestimonies()
        res.status(200).json({ status: 'success', data: testimonies })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const testimonies = await getAllTestimonies()
        res.status(200).json({ status: 'success', data: testimonies })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params
        if (typeof userId !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid user ID',
            })
        }
        const testimonies = await getUserTestimonies(userId)
        res.status(200).json({ status: 'success', data: testimonies })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const id = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid user ID',
            })
        }
        const testimony = await getTestimonyById(id)
        res.status(200).json({ status: 'success', data: testimony })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const id = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid user ID',
            })
        }
        const testimony = await updateTestimony(id, req.body)
        res.status(200).json({
            status: 'success',
            message: 'Testimony updated',
            data: testimony,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const approve = async (req: Request, res: Response) => {
    try {
        const id = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid user ID',
            })
        }
        const testimony = await approveTestimony(
            id,
            req.user!.userId
        )
        res.status(200).json({
            status: 'success',
            message: 'Testimony approved',
            data: testimony,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const reject = async (req: Request, res: Response) => {
    try {
        const id = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid user ID',
            })
        }
        const testimony = await rejectTestimony(id)
        res.status(200).json({
            status: 'success',
            message: 'Testimony rejected',
            data: testimony,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const id = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid user ID',
            })
        }
        await deleteTestimony(id)
        res.status(200).json({
            status: 'success',
            message: 'Testimony deleted',
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await getTestimonyStats()
        res.status(200).json({ status: 'success', data: stats })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}