import { Request, Response } from 'express'
import {
    createPrayerRequest,
    getAllPrayerRequests,
    getPublicPrayerRequests,
    getUserPrayerRequests,
    getPrayerRequestById,
    updatePrayerRequest,
    deletePrayerRequest,
    updatePrayerStatus,
    getPrayerStats,
} from './prayer-requests.service'

export const create = async (req: Request, res: Response) => {
    try {
        const request = await createPrayerRequest({...req.body, userId: req.user?.userId})
        res.status(201).json({
            status: 'success',
            message: 'Prayer request submitted successfully',
            data: request,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const { status } = req.query
        const requests = await getAllPrayerRequests(status as string)
        res.status(200).json({ status: 'success', data: requests })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getPublic = async (req: Request, res: Response) => {
    try {
        const requests = await getPublicPrayerRequests()
        res.status(200).json({ status: 'success', data: requests })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getByUser = async (req: Request, res: Response) => {
    try {
        const {userId} = req.params
        if(typeof userId !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ID'
            })
        }

        const requests = await getUserPrayerRequests(userId)
        res.status(200).json({ status: 'success', data: requests })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ID'
            })
        }

        const request = await getPrayerRequestById(id)
        res.status(200).json({ status: 'success', data: request })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ID'
            })
        }

        const request = await updatePrayerRequest(id, req.body)
        res.status(200).json({
            status: 'success',
            message: 'Prayer request updated',
            data: request,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ID'
            })
        }

        await deletePrayerRequest(id)
        res.status(200).json({
            status: 'success',
            message: 'Prayer request deleted',
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ID'
            })
        }

        const { status } = req.body
        const request = await updatePrayerStatus(id, status)
        res.status(200).json({
            status: 'success',
            message: `Prayer request marked as ${status.toLowerCase()}`,
            data: request,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await getPrayerStats()
        res.status(200).json({ status: 'success', data: stats })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}