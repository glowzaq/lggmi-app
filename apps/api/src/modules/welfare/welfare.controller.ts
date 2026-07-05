import { Request, Response } from 'express'
import {
    createWelfare,
    getAllWelfare,
    getWelfareById,
    updateWelfare,
    deleteWelfare,
    getWelfareStats,
} from './welfare.service'

export const create = async (req: Request, res: Response) => {
    try {
        const record = await createWelfare(req.body)
        res.status(201).json({
            status: 'success',
            message: 'Welfare record created',
            data: record,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const records = await getAllWelfare()
        res.status(200).json({ status: 'success', data: records })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({ status: 'error', message: 'Invalid ID' })
        }
        const record = await getWelfareById(id)
        res.status(200).json({ status: 'success', data: record })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({ status: 'error', message: 'Invalid ID' })
        }
        const record = await updateWelfare(id, req.body)
        res.status(200).json({
            status: 'success',
            message: 'Welfare record updated',
            data: record,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({ status: 'error', message: 'Invalid ID' })
        }
        await deleteWelfare(id)
        res.status(200).json({
            status: 'success',
            message: 'Welfare record deleted',
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await getWelfareStats()
        res.status(200).json({ status: 'success', data: stats })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}