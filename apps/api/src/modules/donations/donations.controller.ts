import { Request, Response } from 'express'
import {
    createDonation,
    getAllDonations,
    getUserDonations,
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
        const { startDate, endDate, type, userId } = req.query
        const donations = await getAllDonations({
            startDate: startDate as string,
            endDate: endDate as string,
            type: type as string,
            userId: userId as string,
        })
        res.status(200).json({ status: 'success', data: donations })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params as { userId: string }
        const data = await getUserDonations(userId)
        res.status(200).json({ status: 'success', data })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const donation = await getDonationById(id)
        res.status(200).json({ status: 'success', data: donation })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
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
        const { id } = req.params as { id: string }
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