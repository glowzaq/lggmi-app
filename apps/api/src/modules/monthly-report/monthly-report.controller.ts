import { Request, Response } from 'express'
import {
    createMonthlyReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport,
} from './monthly-report.service'

export const create = async (req: Request, res: Response) => {
    try {
        const report = await createMonthlyReport(
            req.body,
            req.user!.userId
        )
        res.status(201).json({
            status: 'success',
            message: 'Monthly report created',
            data: report,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const reports = await getAllReports()
        res.status(200).json({ status: 'success', data: reports })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            throw new Error('Invalid report ID')
        }
        const report = await getReportById(id)
        res.status(200).json({ status: 'success', data: report })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            throw new Error('Invalid report ID')
        }
        const report = await updateReport(id, req.body)
        res.status(200).json({
            status: 'success',
            message: 'Report updated',
            data: report,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            throw new Error('Invalid report ID')
        }
        await deleteReport(id)
        res.status(200).json({
            status: 'success',
            message: 'Report deleted',
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}