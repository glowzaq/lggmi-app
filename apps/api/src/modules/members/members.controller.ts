import { Request, Response } from "express"
import { deactivateMember, getAllMembers, getMemberById, getMemberStats, getMyProfile, updateMember } from "./members.service"

export const getMembers = async (req: Request, res: Response) => {
    try {
        const members = await getAllMembers()
        res.status(200).json({status: 'success', data: members})
    } catch (error: any) {
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId
        if (typeof userId !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid ID'
            })
        }
        const member = await getMyProfile(userId)
        res.status(200).json({status: 'success', data: member})
    } catch (error: any) {
        console.error(error.message)
        res.status(400).json({status: 'error', message: error.message})
    }
}

export const getMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid member ID'
            })
        }
        const member = await getMemberById(id)
        res.status(200).json({status: 'success', data: member})
    } catch (error: any) {
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const updateMemberProfile = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        if (typeof id !== 'string' || !id) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid member ID',
            })
        }

        const member = await updateMember(id, req.body)
        res.status(200).json({
            status: 'success',
            message: 'Member updated successfully',
            data: member,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const removeMember = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        if (typeof id !== 'string' || !id) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid member ID',
            })
        }

        await deactivateMember(id)
        res.status(200).json({
            status: 'success',
            message: 'Member deactivated successfully',
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await getMemberStats()
        res.status(200).json({ status: 'success', data: stats })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}
