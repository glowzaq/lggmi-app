import { Request, Response } from 'express'
import {
    createPrayerRequest,
    getAllPrayerRequests,
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

export const getByUser = async (req: Request, res: Response) => {
    try {
        const {userId} = req.params as {userId: string}
        const requests = await getUserPrayerRequests(userId)
        res.status(200).json({ status: 'success', data: requests })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const request = await getPrayerRequestById(id)
        res.status(200).json({ status: 'success', data: request })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }

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
        const { id } = req.params as { id: string }

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
        const { id } = req.params as { id: string }
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