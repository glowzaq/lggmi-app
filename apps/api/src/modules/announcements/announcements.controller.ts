import { Request, Response } from "express";
import { createAnnouncement, deleteAnnouncement, getActiveAnnouncements, getAllAnnouncements, getAnnouncementById, toggleAnnouncement, updateAnnouncement } from "./announcements.service";

export const create = async (req: Request, res: Response) => {
    try {
        const announcement = await createAnnouncement(req.body)
        res.status(201).json({
            status: 'success',
            message: 'Announcement created successfully',
            data: announcement,
        })
    } catch (error: any) {
        res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const announcements = await getAllAnnouncements()
        res.status(200).json({ status: 'success', data: announcements })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getActive = async (req: Request, res: Response) => {
    try {
        const announcements = await getActiveAnnouncements()
        res.status(200).json({ status: 'success', data: announcements })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

export const getOne = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ID'
            })
        }
        const announcement = await getAnnouncementById(id)
        res.status(200).json({ status: 'success', data: announcement })
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
        const announcement = await updateAnnouncement(id, req.body)
        res.status(200).json({
            status: 'success',
            message: 'Announcement updated successfully',
            data: announcement,
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
        await deleteAnnouncement(id)
        res.status(200).json({
            status: 'success',
            message: 'Announcement deleted successfully',
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const toggle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ID'
            })
        }
        const announcement = await toggleAnnouncement(id)
        res.status(200).json({
            status: 'success',
            message: `Announcement ${announcement.isActive ? 'activated' : 'deactivated'}`,
            data: announcement,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}