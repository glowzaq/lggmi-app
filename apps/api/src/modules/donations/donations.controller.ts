import { Request, Response } from 'express'
import {
    createDonation,
    getAllDonations,
    getMemberDonations,
    getDonationById,
    updateDonation,
    deleteDonation,
    getDonationStats,
} from './donations.service'

export const create = async (req: Request, res: Response) => {
    try {
        const donation = await createDonation(req.body)
        res.status(201).json({
            status: 'success',
            message: 'Donation recorded successfully',
            data: donation,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, type, memberId } = req.query
        const donations = await getAllDonations({
            startDate: startDate as string,
            endDate: endDate as string,
            type: type as string,
            memberId: memberId as string,
        })
        res.status(200).json({ status: 'success', data: donations })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getByMember = async (req: Request, res: Response) => {
    try {
        const {memberId} = req.params
        if (typeof memberId !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid member ID'
            })
        }
        const data = await getMemberDonations(memberId)
        res.status(200).json({ status: 'success', data })
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
        const donation = await getDonationById(id)
        res.status(200).json({ status: 'success', data: donation })
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
        const donation = await updateDonation(id, req.body)
        res.status(200).json({
            status: 'success',
            message: 'Donation updated successfully',
            data: donation,
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
        await deleteDonation(id)
        res.status(200).json({
            status: 'success',
            message: 'Donation deleted successfully',
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await getDonationStats()
        res.status(200).json({ status: 'success', data: stats })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}