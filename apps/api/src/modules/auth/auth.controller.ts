import { Request, Response } from "express"
import { loginUser, registerUser } from "./auth.services"

export const register = async (req: Request, res: Response) => {
    try {
        const result = await registerUser(req.body)
        res.status(201).json({
            status: 'success',
            data: result,
            message: 'Registration successful',
        })
    } catch (error: any) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const result = await loginUser(req.body)
        res.status(200).json({
            status: 'success',
            data: result,
            message: 'Login successful',
        })
    } catch (error: any) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        })
    }
}