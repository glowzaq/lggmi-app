import { bulkMarkAttendance, getAttendanceByEvent, getAttendanceStats, getMemberAttendance, markAttendance } from "./attendance.service"
import { Request, Response } from "express"

export const mark = async (req: Request, res: Response) => {
    try {
        const attendance = await markAttendance(req.body)
        res.status(200).json({
            status: 'success',
            message: 'Attendance marked successfully',
            data: attendance
        })
    } catch (error:any) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

export const bulkMark = async (req: Request, res: Response) => {
    try {
        const results = await bulkMarkAttendance(req.body)
        res.status(200).json({
            status: 'success',
            data: results,
            message: `${results.length} attendance records saved`
        })
    } catch (error: any) {
        res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}

export const getByEvent = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params
        if(typeof eventId !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid event ID'
            })
        }
        const data = await getAttendanceByEvent(eventId)
        res.status(200).json({
            status: 'success',
            data
        })
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

export const getByMember = async (req: Request, res: Response) => {
    try {
        const { memberId } = req.params
        if (typeof memberId !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid event ID'
            })
        }
        const data = await getMemberAttendance(memberId)
        res.status(200).json({ status: 'success', data })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await getAttendanceStats()
        res.status(200).json({ status: 'success', data: stats })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}