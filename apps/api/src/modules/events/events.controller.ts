import { Request, Response } from "express"
import { createEvent, deleteEvent, getAllEvents, getEventById, getEventStats, getUpcomingEvents, updateEvent } from "./events.service"

export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await getAllEvents()
        res.status(200).json({status: 'success', data: events})
    } catch (error: any) {
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const event = await getEventById(id)
        res.status(200).json({status: 'success', data: event})
    }catch (error: any) {
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const create = async (req: Request, res: Response) => {
    try {
        const event = await createEvent(req.body)
        res.status(200).json({
            status: 'success',
            message: 'Event created successfully',
            data: event,
        })
    } catch (error: any) {
        res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}

export const getUpcoming = async (req: Request, res: Response) => {
    try {
        const events = await getUpcomingEvents()
        res.status(200).json({
            status: 'success',
            data: events
        })
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        const event = await updateEvent(id, req.body)
        res.status(200).json({
            status: 'success',
            message: 'Event updated successfully',
            data: event
        })
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string }
        await deleteEvent(id)
        res.status(200).json({
            status: 'success',
            message: 'Event deleted successfully',
        })
    } catch(error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await getEventStats()
        res.status(200).json({status: 'success', data: stats})
    } catch (error: any) {
        res.status(500).json({status: 'error', messae: error.message})
    }
}