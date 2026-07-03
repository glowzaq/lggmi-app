import { Request, Response } from 'express'
import {
    upsertTodayLog,
    getTodayLog,
    getUserLogs,
    getUserSpiritualStats,
    getCongregationSpiritualStats,
} from './spiritual-growth.service'

export const logToday = async (req: Request, res: Response) => {
    try {
        const log = await upsertTodayLog(req.body)
        res.status(200).json({
            status: 'success',
            message: 'Spiritual log saved',
            data: log,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getToday = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        if (typeof userId !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ID'
            })
        }
        const log = await getTodayLog(userId)
        res.status(200).json({
            status: 'success',
            data: log ?? null,
        })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getLogs = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        if (typeof userId !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ID'
            })
        }

        const days = req.query.days ? Number(req.query.days) : 30
        const logs = await getUserLogs(userId, days)
        res.status(200).json({ status: 'success', data: logs })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const getStats = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        if (typeof userId !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ID'
            })
        }

        const stats = await getUserSpiritualStats(userId)
        res.status(200).json({ status: 'success', data: stats })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getCongregationStats = async (req: Request, res: Response) => {
    try {
        const stats = await getCongregationSpiritualStats()
        res.status(200).json({ status: 'success', data: stats })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}