import { Request, Response } from 'express'
import { registerUser, loginUser, getMyProfile } from './auth.services'

export const register = async (req: Request, res: Response) => {
    try {
        const result = await registerUser(req.body)
        res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: result,
        })
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: error.message })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const result = await loginUser(req.body)
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: result,
        })
    } catch (error: any) {
        res.status(401).json({ status: 'error', message: error.message })
    }
}

export const getMe = async (req: Request, res: Response) => {
    try {
        const profile = await getMyProfile(req.user!.userId)
        res.status(200).json({ status: 'success', data: profile })
    } catch (error: any) {
        res.status(404).json({ status: 'error', message: error.message })
    }
}