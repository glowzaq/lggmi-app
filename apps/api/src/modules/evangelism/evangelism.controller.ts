import { Request, Response } from 'express'
import {
    createEvangelism,
    getAllEvangelism,
    getEvangelismById,
    updateEvangelism,
    deleteEvangelism,
    getEvangelismStats,
} from './evangelism.service'

export const create = async (req: Request, res: Response) => {
    try {
        const record = await createEvangelism(req.body)
        res.status(201).json({
            status: 'success',
            message: 'Evangelism record created',
            data: record,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const records = await getAllEvangelism()
        res.status(200).json({ status: 'success', data: records })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({ status: 'error', message: 'ID is required' })
        }
        const record = await getEvangelismById(id)
        res.status(200).json({ status: 'success', data: record })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({ status: 'error', message: 'ID is required' })
        }
        const record = await updateEvangelism(id, req.body)
        res.status(200).json({
            status: 'success',
            message: 'Evangelism record updated',
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
            return res.status(400).json({ status: 'error', message: 'ID is required' })
        }
        await deleteEvangelism(id)
        res.status(200).json({
            status: 'success',
            message: 'Evangelism record deleted',
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await getEvangelismStats()
        res.status(200).json({ status: 'success', data: stats })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}