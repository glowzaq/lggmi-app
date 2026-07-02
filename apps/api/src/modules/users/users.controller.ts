import { Request, Response } from "express"
import { deactivateUser, getAllUsers, getUserById, getUserStats, updateUser } from "./users.service"

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers()
        res.status(200).json({status: 'success', data: users})
    } catch (error: any) {
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (typeof id !== 'string') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid User ID'
            })
        }
        const user = await getUserById(id)
        res.status(200).json({status: 'success', data: user})
    } catch (error: any) {
        res.status(500).json({status: 'error', message: error.message})
    }
}

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        if (typeof id !== 'string' || !id) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid User ID',
            })
        }

        const user = await updateUser(id, req.body)
        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: user,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const removeUser = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
        if (typeof id !== 'string' || !id) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid User ID',
            })
        }

        await deactivateUser(id)
        res.status(200).json({
            status: 'success',
            message: 'User deactivated successfully',
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await getUserStats()
        res.status(200).json({ status: 'success', data: stats })
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}
